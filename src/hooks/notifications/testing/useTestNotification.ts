
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationEvents } from './useNotificationEvents';
import { useEnvironmentInfo } from './useEnvironmentInfo';

export function useTestNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { onShow, onClick, onError, onClose } = useNotificationEvents();
  const { logEnvironmentInfo } = useEnvironmentInfo();

  const createTestNotification = useCallback(async (): Promise<{ success: boolean }> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        throw new Error('Notification API missing at send time');
      }

      console.log('[NotificationTesting] Attempting to construct Notification instance...');
      let notification: Notification;
      
      try {
        notification = new Notification('Test Notification', {
          body: 'This is a direct browser notification test (' + new Date().toLocaleTimeString() + ')',
          icon: '/favicon.ico',
          tag: 'test-notification-' + Date.now(),
          requireInteraction: true,
          silent: false
        });
        console.log('[NotificationTesting] Notification object constructed:', notification);
      } catch (notifErr) {
        console.error('[NotificationTesting] Failed to construct notification:', notifErr);
        throw notifErr;
      }

      notification.onshow = onShow;
      notification.onclick = () => onClick(notification);
      notification.onerror = onError;
      notification.onclose = onClose;

      toast({
        title: "Test Notification Sent",
        description: "A notification was sent. If you don't see it, check your browser settings."
      });

      setTimeout(logEnvironmentInfo, 500);

      return { success: true };
    } catch (err) {
      console.error('[NotificationTesting] Error sending test notification:', err);
      setError(err instanceof Error ? err.message : 'Failed to send test notification');
      toast({
        variant: "destructive",
        title: "Notification Error",
        description: err instanceof Error ? err.message : 'Failed to send test notification'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast, onShow, onClick, onError, onClose, logEnvironmentInfo]);

  return {
    isLoading,
    error,
    sendTestNotification: createTestNotification
  };
}
