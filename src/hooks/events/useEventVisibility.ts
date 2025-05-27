
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { eventVisibilityService, type EventAccessInfo } from '@/services/EventVisibilityService';

export const useEventVisibility = (eventId: string, userId?: string) => {
  const [accessInfo, setAccessInfo] = useState<EventAccessInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, [eventId, userId]);

  const checkAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await eventVisibilityService.checkEventAccess(eventId, userId);
      setAccessInfo(result);
      
      if (!result.hasAccess && result.reason) {
        // Optionally show access denied reason as toast
        console.log('Access denied:', result.reason);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to check event access',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccess = () => {
    checkAccess();
  };

  return {
    accessInfo,
    hasAccess: accessInfo?.hasAccess || false,
    accessType: accessInfo?.accessType,
    reason: accessInfo?.reason,
    requiresFollowing: accessInfo?.requiresFollowing,
    isLoading,
    error,
    refreshAccess
  };
};
