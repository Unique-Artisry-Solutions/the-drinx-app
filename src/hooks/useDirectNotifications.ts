
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

  // Check if notifications are supported
  useEffect(() => {
    const hasNotificationSupport = 'Notification' in window;
    setIsSupported(hasNotificationSupport);
    
    if (hasNotificationSupport) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Request permission function
  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }
      
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('Permission response:', permission);
      
      setPermissionStatus(permission);
      setLastCheck(new Date());
      
      if (permission === 'granted') {
        toast({
          title: "Notification Access Granted",
          description: "You will now receive notifications from this application."
        });
        return true;
      } else if (permission === 'denied') {
        toast({
          variant: "destructive",
          title: "Notification Access Denied",
          description: "Please enable notifications in your browser settings to continue."
        });
        return false;
      }
      
      return permission === 'granted';
    } catch (err) {
      console.error('Error requesting notification permission:', err);
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

  // Check current permission
  const checkPermission = useCallback(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      console.log('Current notification permission:', currentPermission);
      setPermissionStatus(currentPermission);
      setLastCheck(new Date());
      return currentPermission;
    }
    return null;
  }, []);

  // Send a direct test notification
  const sendTestNotification = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!isSupported) {
        throw new Error('Notifications are not supported in this browser');
      }
      
      if (permissionStatus !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Notification permission not granted');
        }
      }
      
      const notification = new Notification('Test Notification', {
        body: 'This is a direct browser notification test',
        icon: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: true
      });
      
      notification.onclick = () => {
        console.log('Notification clicked');
        window.focus();
        notification.close();
      };
      
      toast({
        title: "Test Notification Sent",
        description: "A test notification was displayed directly by the browser."
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error sending test notification:', err);
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

  // Reset permissions system
  const resetPermissionState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clear service worker registrations
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('All service worker registrations cleared');
      }
      
      // Re-check permissions
      checkPermission();
      
      toast({
        title: "Permission System Reset",
        description: "Notification system has been reset. Please try again."
      });
      
      return true;
    } catch (err) {
      console.error('Error resetting permission state:', err);
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
