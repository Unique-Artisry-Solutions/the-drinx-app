
import { useState, useEffect, useCallback } from 'react';

export interface UseDirectNotificationsReturn {
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  lastCheck: Date;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<NotificationPermission>;
  checkPermission: () => Promise<NotificationPermission>;
  sendTestNotification: () => Promise<void>;
  resetPermissionState: () => void;
}

export const useDirectNotifications = (): UseDirectNotificationsReturn => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [lastCheck, setLastCheck] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = 'Notification' in window;

  const checkPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    setLastCheck(new Date());
    const permission = Notification.permission;
    setPermissionStatus(permission);
    return permission;
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      setError('Notifications not supported');
      return 'denied';
    }

    setIsLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      setLastCheck(new Date());
      return permission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      throw new Error('Notifications not supported');
    }

    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    setIsLoading(true);
    setError(null);

    try {
      new Notification('Test Notification', {
        body: 'This is a test notification from the Swig app',
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send notification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const resetPermissionState = useCallback(() => {
    setError(null);
    setLastCheck(new Date());
    if (isSupported) {
      setPermissionStatus(Notification.permission);
    }
  }, [isSupported]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

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
};
