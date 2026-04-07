
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseSwigCircuitJoinProps {
  swigCircuitId: string;
  user: User | null;
  onSuccess: () => void;
}

/**
 * Hook for handling joining a bar crawl.
 * Uses direct Supabase calls for data access.
 */
export const useSwigCircuitJoin = ({ 
  swigCircuitId, 
  user, 
  onSuccess 
}: UseSwigCircuitJoinProps) => {
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
      console.log('Attempting to join bar crawl:', swigCircuitId);
      
      const { error } = await supabase
        .from('user_bar_crawl_participation')
        .insert({
          user_id: user.id,
          bar_crawl_id: swigCircuitId,
          joined_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
      
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
