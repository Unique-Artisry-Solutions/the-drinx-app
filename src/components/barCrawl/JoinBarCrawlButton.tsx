
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';

interface JoinBarCrawlButtonProps {
  barCrawlId: string;
  className?: string;
}

const JoinBarCrawlButton: React.FC<JoinBarCrawlButtonProps> = ({ barCrawlId, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    const checkParticipation = async () => {
      try {
        // Check if user is already participating in this bar crawl
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
        description: 'Please sign in to join this bar crawl',
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
          title: 'Joined Bar Crawl',
          description: 'You have successfully joined this bar crawl!',
        });
        
        setIsJoined(true);
      } else {
        // For real data, use Supabase
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
          title: 'Joined Bar Crawl',
          description: 'You have successfully joined this bar crawl!',
        });
        
        setIsJoined(true);
      }
    } catch (error: any) {
      console.error('Failed to join bar crawl:', error);
      
      // Show error toast with more descriptive message
      let errorMessage = 'Failed to join bar crawl. Please try again.';
      
      if (error?.message?.includes('violates row level security policy')) {
        errorMessage = 'You do not have permission to join this bar crawl.';
      } else if (error?.message?.includes('violates foreign key constraint')) {
        errorMessage = 'This bar crawl does not exist.';
      } else if (error?.message?.includes('violates unique constraint')) {
        errorMessage = 'You are already participating in this bar crawl.';
      } else if (error?.message?.includes('invalid input syntax')) {
        errorMessage = 'Invalid bar crawl ID format.';
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
          title: 'Left Bar Crawl',
          description: 'You have left this bar crawl.',
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
          title: 'Left Bar Crawl',
          description: 'You have left this bar crawl.',
        });
        
        setIsJoined(false);
      }
    } catch (error: any) {
      console.error('Failed to leave bar crawl:', error);
      
      toast({
        title: 'Error',
        description: 'Failed to leave bar crawl. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={isJoined ? handleLeaveBarCrawl : handleJoinBarCrawl} 
      disabled={isLoading}
      variant={isJoined ? "outline" : "default"}
      className={className}
    >
      {isLoading 
        ? (isJoined ? 'Leaving...' : 'Joining...') 
        : (isJoined ? 'Leave Bar Crawl' : 'Join Bar Crawl')}
    </Button>
  );
};

export default JoinBarCrawlButton;
