
import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { isValidUUID, formatBarCrawlErrorMessage, isSampleBarCrawlId } from '@/utils/barCrawlUtils';
import { User } from '@supabase/supabase-js';

interface UseBarCrawlLeaveProps {
  barCrawlId: string;
  user: User | null;
  onSuccess: () => void;
}

/**
 * Hook for handling leaving a bar crawl.
 */
export const useBarCrawlLeave = ({ 
  barCrawlId, 
  user,
  onSuccess 
}: UseBarCrawlLeaveProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
        
        onSuccess();
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
          
          onSuccess();
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
          
          onSuccess();
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
    isLoading,
    error,
    handleLeave
  };
};
