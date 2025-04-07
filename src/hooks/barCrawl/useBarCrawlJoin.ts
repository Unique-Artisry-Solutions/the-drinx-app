
import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { isValidUUID, formatBarCrawlErrorMessage, isSampleBarCrawlId } from '@/utils/barCrawlUtils';
import { User } from '@supabase/supabase-js';

interface UseBarCrawlJoinProps {
  barCrawlId: string;
  user: User | null;
  onSuccess: () => void;
}

/**
 * Hook for handling joining a bar crawl.
 */
export const useBarCrawlJoin = ({ 
  barCrawlId, 
  user, 
  onSuccess 
}: UseBarCrawlJoinProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
        
        onSuccess();
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
          
          onSuccess();
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
          
          onSuccess();
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

  return {
    isLoading,
    error,
    handleJoin
  };
};
