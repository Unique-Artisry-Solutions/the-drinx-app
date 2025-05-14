
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { BarCrawlRepositoryFactory } from '@/repositories/RepositoryFactory';

interface UseBarCrawlLeaveProps {
  barCrawlId: string;
  user: User | null;
  onSuccess: () => void;
}

/**
 * Hook for handling leaving a bar crawl.
 * Uses the repository pattern for data access.
 */
export const useBarCrawlLeave = ({ 
  barCrawlId, 
  user,
  onSuccess 
}: UseBarCrawlLeaveProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLeave = async (barCrawlIdParam?: string) => {
    // Use provided parameter or fall back to prop
    const crawlId = barCrawlIdParam || barCrawlId;
    
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to leave bar crawl:', crawlId);
      
      // Get the repository
      const repository = BarCrawlRepositoryFactory.getBarCrawlParticipationRepository();
      
      // Leave the bar crawl
      await repository.leaveBarCrawl(user.id, crawlId);
      
      toast({
        title: 'Left Swig Circuit',
        description: 'You have left this Swig Circuit.',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to leave bar crawl:', error);
      
      const errorMessage = error.message || 'Failed to leave bar crawl';
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
