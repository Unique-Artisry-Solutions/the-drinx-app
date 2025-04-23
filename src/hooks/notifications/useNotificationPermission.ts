
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useNotificationPermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      console.log('[NotificationPermission] Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('[NotificationPermission] Permission response:', permission);

      const isGranted = permission === 'granted';
      if (isGranted) {
        toast({
          title: "Notification Access Granted",
          description: "You will now receive notifications from this application."
        });

        try {
          const testNotif = new Notification('Permission Granted', {
            body: 'Notifications are now enabled for this application',
            icon: '/favicon.ico'
          });
          console.log('[NotificationPermission] Test notification sent after permission granted');
        } catch (e) {
          console.error('[NotificationPermission] Error sending test notification after permission:', e);
        }
      } else if (permission === 'denied') {
        toast({
          variant: "destructive",
          title: "Notification Access Denied",
          description: "Please enable notifications in your browser settings to continue."
        });
      }

      return isGranted;
    } catch (err) {
      console.error('[NotificationPermission] Error requesting notification permission:', err);
      setError(err instanceof Error ? err.message : 'Failed to request notification permission');
      toast({
        variant: "destructive",
        title: "Permission Error",
        description: err instanceof Error ? err.message : 'Failed to request notification permission'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    error,
    requestPermission
  };
}
