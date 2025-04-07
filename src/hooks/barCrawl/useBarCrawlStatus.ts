
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { isValidUUID, isSampleBarCrawlId } from '@/utils/barCrawlUtils';
import { User } from '@supabase/supabase-js';

interface UseBarCrawlStatusProps {
  barCrawlId: string;
  user: User | null;
}

/**
 * Hook to check if a user is participating in a bar crawl.
 */
export const useBarCrawlStatus = ({ barCrawlId, user }: UseBarCrawlStatusProps) => {
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  return {
    isCheckingStatus,
    isJoined,
    error
  };
};
