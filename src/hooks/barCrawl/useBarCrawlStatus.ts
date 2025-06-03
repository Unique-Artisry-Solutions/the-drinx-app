
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseBarCrawlStatusProps {
  barCrawlId: string;
  user: User | null;
}

/**
 * Hook to check if a user is participating in a bar crawl.
 * Uses direct Supabase calls for data access.
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
        const { data, error } = await supabase
          .from('user_bar_crawl_participation')
          .select('id')
          .eq('user_id', user.id)
          .eq('bar_crawl_id', barCrawlId)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
          throw error;
        }

        setIsJoined(!!data);
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
