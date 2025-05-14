
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { BarCrawlRepositoryFactory } from '@/repositories/RepositoryFactory';

interface UseBarCrawlJoinProps {
  barCrawlId: string;
  user: User | null;
  onSuccess: () => void;
}

/**
 * Hook for handling joining a bar crawl.
 * Uses the repository pattern for data access.
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
      
      // Get the repository
      const repository = BarCrawlRepositoryFactory.getBarCrawlParticipationRepository();
      
      // Join the bar crawl
      await repository.joinBarCrawl(user.id, barCrawlId);
      
      // Show success toast
      toast({
        title: 'Joined Swig Circuit',
        description: 'You have successfully joined this Swig Circuit!',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to join bar crawl:', error);
      
      const errorMessage = error.message || 'Failed to join bar crawl';
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
