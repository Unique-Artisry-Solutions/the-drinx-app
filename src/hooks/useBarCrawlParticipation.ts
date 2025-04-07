
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

interface UseBarCrawlParticipationProps {
  barCrawlId: string;
}

export const useBarCrawlParticipation = ({ barCrawlId }: UseBarCrawlParticipationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    const checkParticipation = async () => {
      try {
        // Check if sample data is being used
        const isSampleId = typeof barCrawlId === 'string' && barCrawlId.startsWith('bc-');
        
        if (isSampleId) {
          // For sample data, check localStorage
          const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
          const isAlreadyJoined = existingParticipations.some(
            (p: any) => p.bar_crawl_id === barCrawlId && p.user_id === (user.id || 'sample-user')
          );
          setIsJoined(isAlreadyJoined);
        } else {
          // For real data, check Supabase
          const { data, error } = await supabaseClient
            .from('user_bar_crawl_participation')
            .select('id')
            .eq('bar_crawl_id', barCrawlId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error checking participation:', error);
            return;
          }
          
          setIsJoined(!!data);
        }
      } catch (err) {
        console.error('Failed to check participation:', err);
      }
    };
    
    checkParticipation();
  }, [barCrawlId, user]);

  const handleJoinBarCrawl = async () => {
    // If not authenticated, show sign in message
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to join this Swig Circuit',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to join bar crawl:', barCrawlId);
      
      // Handle sample data IDs (like bc-123) vs real UUIDs
      const isSampleId = typeof barCrawlId === 'string' && barCrawlId.startsWith('bc-');
      
      if (isSampleId) {
        // For sample data, just simulate successful join
        console.log('Sample bar crawl detected, simulating join');
        
        // Store in localStorage for demo purposes
        const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
        existingParticipations.push({
          id: `participation-${Date.now()}`,
          user_id: user.id || 'sample-user',
          bar_crawl_id: barCrawlId,
          joined_at: new Date().toISOString()
        });
        localStorage.setItem('user_bar_crawl_participations', JSON.stringify(existingParticipations));
        
        // Show success toast
        toast({
          title: 'Joined Swig Circuit',
          description: 'You have successfully joined this Swig Circuit!',
        });
        
        setIsJoined(true);
      } else {
        // Check if this is a bypass account or a regular account
        const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
        
        if (isAdminBypass) {
          // For bypass accounts, use localStorage to simulate joining
          const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
          existingParticipations.push({
            id: `participation-${Date.now()}`,
            user_id: user.id,
            bar_crawl_id: barCrawlId,
            joined_at: new Date().toISOString()
          });
          localStorage.setItem('user_bar_crawl_participations', JSON.stringify(existingParticipations));
          
          toast({
            title: 'Joined Swig Circuit',
            description: 'You have successfully joined this Swig Circuit!',
          });
          
          setIsJoined(true);
        } else {
          // For real users, use Supabase
          // Validate UUID format to prevent invalid format errors
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(barCrawlId)) {
            throw new Error('Invalid bar crawl ID format');
          }
          
          const { error } = await supabaseClient
            .from('user_bar_crawl_participation')
            .insert({
              user_id: user.id,
              bar_crawl_id: barCrawlId
            });

          if (error) {
            console.error('Error joining bar crawl:', error);
            throw error;
          }

          toast({
            title: 'Joined Swig Circuit',
            description: 'You have successfully joined this Swig Circuit!',
          });
          
          setIsJoined(true);
        }
      }
    } catch (error: any) {
      console.error('Failed to join bar crawl:', error);
      
      // Show error toast with more descriptive message
      let errorMessage = 'Failed to join Swig Circuit. Please try again.';
      
      if (error?.message?.includes('violates row level security policy')) {
        errorMessage = 'You do not have permission to join this Swig Circuit.';
      } else if (error?.message?.includes('violates foreign key constraint')) {
        errorMessage = 'This Swig Circuit does not exist.';
      } else if (error?.message?.includes('violates unique constraint')) {
        errorMessage = 'You are already participating in this Swig Circuit.';
      } else if (error?.message?.includes('invalid input syntax') || error?.message?.includes('Invalid bar crawl ID format')) {
        errorMessage = 'Invalid Swig Circuit ID format. Please contact support.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLeaveBarCrawl = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      console.log('Attempting to leave bar crawl:', barCrawlId);
      
      // Handle sample data
      const isSampleId = typeof barCrawlId === 'string' && barCrawlId.startsWith('bc-');
      
      if (isSampleId) {
        // For sample data, simulate leaving
        console.log('Sample bar crawl detected, simulating leave');
        
        // Update localStorage
        const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
        const updatedParticipations = existingParticipations.filter(
          (p: any) => p.bar_crawl_id !== barCrawlId || p.user_id !== user.id
        );
        localStorage.setItem('user_bar_crawl_participations', JSON.stringify(updatedParticipations));
        
        toast({
          title: 'Left Swig Circuit',
          description: 'You have left this Swig Circuit.',
        });
        
        setIsJoined(false);
      } else {
        // Check if this is a bypass account
        const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
        
        if (isAdminBypass) {
          // For bypass accounts, use localStorage
          const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
          const updatedParticipations = existingParticipations.filter(
            (p: any) => p.bar_crawl_id !== barCrawlId || p.user_id !== user.id
          );
          localStorage.setItem('user_bar_crawl_participations', JSON.stringify(updatedParticipations));
          
          toast({
            title: 'Left Swig Circuit',
            description: 'You have left this Swig Circuit.',
          });
          
          setIsJoined(false);
        } else {
          // For real data, use Supabase
          const { error } = await supabaseClient
            .from('user_bar_crawl_participation')
            .delete()
            .eq('bar_crawl_id', barCrawlId)
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error leaving bar crawl:', error);
            throw error;
          }
          
          toast({
            title: 'Left Swig Circuit',
            description: 'You have left this Swig Circuit.',
          });
          
          setIsJoined(false);
        }
      }
    } catch (error: any) {
      console.error('Failed to leave bar crawl:', error);
      
      toast({
        title: 'Error',
        description: 'Failed to leave Swig Circuit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isJoined,
    handleJoin: handleJoinBarCrawl,
    handleLeave: handleLeaveBarCrawl
  };
};
