
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useNotificationTesting() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendTestNotification = useCallback(async (): Promise<{ success: boolean }> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        throw new Error('Notification API missing at send time');
      }

      console.log('[NotificationTesting] Attempting to construct Notification instance...');
      let notification;
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

      notification.onshow = () => {
        console.log('[NotificationTesting] Notification "show" event triggered.');
      };
      notification.onclick = () => {
        console.log('[NotificationTesting] Notification "click" event triggered.');
        window.focus();
        notification.close();
      };
      notification.onerror = (event) => {
        console.error('[NotificationTesting] Notification "error" event:', event);
      };
      notification.onclose = () => {
        console.log('[NotificationTesting] Notification "close" event triggered.');
      };

      toast({
        title: "Test Notification Sent",
        description: "A notification was sent. If you don't see it, check your browser settings."
      });

      setTimeout(() => {
        console.log('[NotificationTesting] Environment info:', {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor,
          language: navigator.language,
          doNotTrack: navigator.doNotTrack,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine
        });
      }, 500);

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
  }, [toast]);

  return {
    isLoading,
    error,
    sendTestNotification
  };
}
