
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { BarCrawlRepositoryFactory } from '@/repositories/RepositoryFactory';

interface UseBarCrawlStatusProps {
  barCrawlId: string;
  user: User | null;
}

/**
 * Hook to check if a user is participating in a bar crawl.
 * Uses the repository pattern for data access.
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
        // Get the repository
        const repository = BarCrawlRepositoryFactory.getBarCrawlParticipationRepository();
        
        // Check if the user is participating
        const participating = await repository.isUserParticipating(user.id, barCrawlId);
        setIsJoined(participating);
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
