
import { useNotifications } from './useNotifications';
import { useState, useCallback } from 'react';

// Enhanced compatibility bridge for useDirectNotifications
export const useDirectNotifications = () => {
  const notifications = useNotifications();
  const [lastCheck] = useState(new Date());
  
  const isSupported = 'Notification' in window;
  const permissionStatus = isSupported ? Notification.permission : 'denied';

  const requestPermission = useCallback(async () => {
    if (!isSupported) return 'denied';
    return await Notification.requestPermission();
  }, [isSupported]);

  const checkPermission = useCallback(async () => {
    return permissionStatus;
  }, [permissionStatus]);

  const sendTestNotification = useCallback(async () => {
    await notifications.sendTestNotification('test');
  }, [notifications]);

  const resetPermissionState = useCallback(async () => {
    // Mock reset functionality
    console.log('Permission state reset');
  }, []);
  
  return {
    sendNotification: notifications.addNotification,
    notifications: notifications.notifications,
    clearNotifications: notifications.clearAll,
    // Additional properties for DirectNotificationTester
    isSupported,
    permissionStatus,
    lastCheck,
    isLoading: notifications.isLoading,
    error: notifications.error,
    requestPermission,
    checkPermission,
    sendTestNotification,
    resetPermissionState
  };
};
