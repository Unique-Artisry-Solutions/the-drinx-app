
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { isValidUUID, formatBarCrawlErrorMessage, isSampleBarCrawlId } from '@/utils/barCrawlUtils';

/**
 * Props for the useBarCrawlParticipation hook.
 */
interface UseBarCrawlParticipationProps {
  /** The ID of the bar crawl to check participation for */
  barCrawlId: string;
}

/**
 * Hook for managing user participation in a bar crawl (Swig Circuit).
 * Handles checking participation status, joining, and leaving.
 * 
 * @param props - The hook properties
 * @returns Object containing participation state and functions
 */
export const useBarCrawlParticipation = ({ barCrawlId }: UseBarCrawlParticipationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Checks if the current user is participating in the bar crawl.
   * Handles both sample data and real database records.
   */
  useEffect(() => {
    if (!user) {
      setIsCheckingStatus(false);
      return;
    }
    
    const checkParticipation = async () => {
      setIsCheckingStatus(true);
      setError(null);
      
      try {
        // Check if sample data is being used
        if (isSampleBarCrawlId(barCrawlId)) {
          // For sample data, check localStorage
          const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
          const isAlreadyJoined = existingParticipations.some(
            (p: any) => p.bar_crawl_id === barCrawlId && p.user_id === (user.id || 'sample-user')
          );
          setIsJoined(isAlreadyJoined);
        } else if (!isValidUUID(barCrawlId)) {
          // Check if ID is a numeric ID (used in some routes)
          const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
          
          if (isAdminBypass) {
            // For bypass accounts, check localStorage even with numeric IDs
            const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
            const isAlreadyJoined = existingParticipations.some(
              (p: any) => p.bar_crawl_id === barCrawlId && p.user_id === (user.id || 'sample-user')
            );
            setIsJoined(isAlreadyJoined);
          } else {
            // For regular users with invalid UUIDs, set error but don't throw to prevent UI disruption
            console.error('Invalid bar crawl ID format:', barCrawlId);
            setError('Invalid bar crawl ID format');
          }
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
            setError(`Failed to check participation: ${error.message}`);
            return;
          }
          
          setIsJoined(!!data);
        }
      } catch (err: any) {
        console.error('Failed to check participation:', err);
        setError(`Failed to check participation: ${err.message}`);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    checkParticipation();
  }, [barCrawlId, user]);

  /**
   * Handles joining a bar crawl.
   * Shows error toast if user is not authenticated.
   * Handles different storage methods based on bar crawl ID type.
   */
  const handleJoin = async () => {
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
    setError(null);

    try {
      console.log('Attempting to join bar crawl:', barCrawlId);
      
      // Handle sample data IDs (like bc-123) vs real UUIDs
      if (isSampleBarCrawlId(barCrawlId)) {
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
        
        if (isAdminBypass || !isValidUUID(barCrawlId)) {
          // For bypass accounts or non-UUID IDs, use localStorage to simulate joining
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
          // For real users with valid UUIDs, use Supabase
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
      
      const errorMessage = formatBarCrawlErrorMessage(error);
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handles leaving a bar crawl.
   * Updates both localStorage for sample/bypass data and database for real data.
   */
  const handleLeave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to leave bar crawl:', barCrawlId);
      
      // Handle sample data
      if (isSampleBarCrawlId(barCrawlId)) {
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
        // Check if this is a bypass account or non-UUID ID
        const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
        
        if (isAdminBypass || !isValidUUID(barCrawlId)) {
          // For bypass accounts or non-UUID IDs, use localStorage
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
          // For real data with valid UUIDs, use Supabase
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
      
      const errorMessage = formatBarCrawlErrorMessage(error);
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,          // Whether a join/leave operation is in progress
    isCheckingStatus,   // Whether the initial status check is in progress
    isJoined,           // Whether the user has joined this bar crawl
    error,              // Any error that occurred during operations
    handleJoin,         // Function to join the bar crawl
    handleLeave,        // Function to leave the bar crawl
  };
};
