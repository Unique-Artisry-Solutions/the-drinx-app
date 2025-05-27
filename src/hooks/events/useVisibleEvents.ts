
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { eventVisibilityService } from '@/services/EventVisibilityService';
import { useToast } from '@/hooks/use-toast';

export const useVisibleEvents = (promoterId?: string) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadVisibleEvents();
  }, [user?.id, promoterId]);

  const loadVisibleEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const visibleEvents = await eventVisibilityService.getVisibleEvents(
        user?.id, 
        promoterId
      );
      
      setEvents(visibleEvents);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEvents = () => {
    loadVisibleEvents();
  };

  return {
    events,
    isLoading,
    error,
    refreshEvents
  };
};
