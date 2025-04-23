
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useNotificationReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetPermissionState = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('[NotificationReset] All service worker registrations cleared');
      }

      toast({
        title: "Permission System Reset",
        description: "Notification system has been reset. Please try again."
      });

      return true;
    } catch (err) {
      console.error('[NotificationReset] Error resetting permission state:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset permission state');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    error,
    resetPermissionState
  };
}
