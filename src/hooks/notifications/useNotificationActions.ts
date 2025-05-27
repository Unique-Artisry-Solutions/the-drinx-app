
import { useState, useCallback } from 'react';
import { useNotificationSystem } from '../useNotificationSystem';

export const useNotificationActions = () => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const { showSuccess, showError } = useNotificationSystem();

  const handleRefreshPermissions = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        showSuccess('Notifications enabled', 'You will now receive push notifications');
      } else if (permission === 'denied') {
        showError('Notifications blocked', 'Please enable notifications in your browser settings');
      }
    }
  }, [showSuccess, showError]);

  const handleSubscribe = useCallback(async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        
        if (permission === 'granted') {
          showSuccess('Notifications enabled', 'You will now receive push notifications');
          return true;
        } else {
          showError('Notifications denied', 'Please enable notifications in your browser settings');
          return false;
        }
      }
    } catch (error) {
      showError('Permission error', 'Failed to request notification permissions');
      return false;
    }
  }, [showSuccess, showError]);

  return {
    permissionStatus,
    handleRefreshPermissions,
    handleSubscribe
  };
};
