
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export function useDirectNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const hasNotificationSupport = 'Notification' in window;
    setIsSupported(hasNotificationSupport);

    if (hasNotificationSupport) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      console.log('[DirectNotifications] Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('[DirectNotifications] Permission response:', permission);

      setPermissionStatus(permission);
      setLastCheck(new Date());

      const isGranted = permission === 'granted';
      if (isGranted) {
        toast({
          title: "Notification Access Granted",
          description: "You will now receive notifications from this application."
        });
        
        // Send a test notification immediately after getting permission to verify
        try {
          const testNotif = new Notification('Permission Granted', {
            body: 'Notifications are now enabled for this application',
            icon: '/favicon.ico'
          });
          console.log('[DirectNotifications] Test notification sent after permission granted');
        } catch (e) {
          console.error('[DirectNotifications] Error sending test notification after permission:', e);
        }
        
        return true;
      } else if (permission === 'denied') {
        toast({
          variant: "destructive",
          title: "Notification Access Denied",
          description: "Please enable notifications in your browser settings to continue."
        });
        return false;
      }

      return isGranted;
    } catch (err) {
      console.error('[DirectNotifications] Error requesting notification permission:', err);
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

  const checkPermission = useCallback(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      console.log('[DirectNotifications] Current notification permission:', currentPermission);
      setPermissionStatus(currentPermission);
      setLastCheck(new Date());
      return currentPermission;
    }
    return null;
  }, []);

  const sendTestNotification = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!isSupported) {
        throw new Error('Notifications are not supported in this browser');
      }

      const isGranted = permissionStatus === 'granted';
      if (!isGranted) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Notification permission not granted');
        }
      }

      // Additional diagnostic: check Notification API
      if (!('Notification' in window)) {
        throw new Error('Notification API missing at send time');
      }

      console.log('[DirectNotifications] Attempting to construct Notification instance...');
      let notification;
      try {
        // Create a notification with more attention-grabbing properties
        notification = new Notification('Test Notification', {
          body: 'This is a direct browser notification test (' + new Date().toLocaleTimeString() + ')',
          icon: '/favicon.ico',
          tag: 'test-notification-' + Date.now(), // Make each notification unique
          requireInteraction: true, // Keep notification visible until user interacts with it
          silent: false // Ensure sound plays if browser supports it
        });
        console.log('[DirectNotifications] Notification object constructed:', notification);
      } catch (notifErr) {
        console.error('[DirectNotifications] Failed to construct notification:', notifErr);
        throw notifErr;
      }

      // Attach event logging for diagnostics:
      notification.onshow = () => {
        console.log('[DirectNotifications] Notification "show" event triggered.');
      };
      notification.onclick = () => {
        console.log('[DirectNotifications] Notification "click" event triggered.');
        window.focus();
        notification.close();
      };
      notification.onerror = (event) => {
        console.error('[DirectNotifications] Notification "error" event:', event);
      };
      notification.onclose = (event) => {
        console.log('[DirectNotifications] Notification "close" event triggered.', event);
      };

      // Check if the notification is visible through alternative feedback
      toast({
        title: "Test Notification Sent",
        description: "A notification was sent. If you don't see it, check your browser settings."
      });

      // Try to detect if the notification is actually showing
      setTimeout(() => {
        console.log('[DirectNotifications] Notification should be visible now. If not visible, check browser settings.');
        // Additional diagnostic info about environment
        console.log('[DirectNotifications] Browser environment:', {
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
      console.error('[DirectNotifications] Error sending test notification:', err);
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
  }, [isSupported, permissionStatus, requestPermission, toast]);

  const resetPermissionState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('[DirectNotifications] All service worker registrations cleared');
      }

      checkPermission();

      toast({
        title: "Permission System Reset",
        description: "Notification system has been reset. Please try again."
      });

      return true;
    } catch (err) {
      console.error('[DirectNotifications] Error resetting permission state:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset permission state');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkPermission, toast]);

  return {
    isSupported,
    permissionStatus,
    lastCheck,
    isLoading,
    error,
    requestPermission,
    checkPermission,
    sendTestNotification,
    resetPermissionState
  };
}
