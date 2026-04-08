
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseSwigCircuitLeaveProps {
  swigCircuitId: string;
  user: User | null;
  onSuccess: () => void;
}

/**
 * Hook for handling leaving a bar crawl.
 * Uses direct Supabase calls for data access.
 */
export const useSwigCircuitLeave = ({ 
  swigCircuitId, 
  user,
  onSuccess 
}: UseSwigCircuitLeaveProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLeave = async (swigCircuitIdParam?: string) => {
    // Use provided parameter or fall back to prop
    const crawlId = swigCircuitIdParam || swigCircuitId;
    
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to leave bar crawl:', crawlId);
      
      const { error } = await supabase
        .from('user_bar_crawl_participation')
        .delete()
        .eq('user_id', user.id)
        .eq('bar_crawl_id', crawlId);

      if (error) {
        throw error;
      }
      
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
