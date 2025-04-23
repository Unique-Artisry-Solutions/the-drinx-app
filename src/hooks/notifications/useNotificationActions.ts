
import { useCallback } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useToast } from '@/hooks/use-toast';
import { debouncedToast } from '@/utils/debouncedToast';

export const useNotificationActions = () => {
  const { 
    subscribeToNotifications,
    permissionStatus,
    checkPermissions 
  } = usePushNotifications();
  const { toast } = useToast();

  const handleRefreshPermissions = useCallback(async (): Promise<void> => {
    const currentPermission = checkPermissions?.();
    if (currentPermission) {
      toast({
        title: "Permission Status",
        description: `Current notification permission: ${currentPermission}`
      });
      return;
    }
  }, [checkPermissions, toast]);

  const handleSubscribe = useCallback(async (): Promise<void> => {
    if (subscribeToNotifications) {
      try {
        await subscribeToNotifications();
        toast({
          title: "Success",
          description: "Notification permissions granted"
        });
      } catch (error) {
        // Handle common errors
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            debouncedToast.error(
              "Permission Denied",
              "You've denied permission for notifications. You can change this in your browser settings.",
              5000
            );
          } else {
            debouncedToast.error(
              "Error",
              `Failed to enable notifications: ${error.message}`,
              5000
            );
          }
        }
      }
    }
  }, [subscribeToNotifications, toast]);

  const sendTestNotification = useCallback(async (category: string): Promise<void> => {
    try {
      toast({
        title: "Test Notification",
        description: `This is a test notification for the ${category} category`,
      });
      
      // Only show web notification if permission is granted
      if (permissionStatus === 'granted') {
        const notification = new Notification(`Test: ${category}`, {
          body: `This is a test notification for the ${category} category`,
          icon: '/favicon.ico',
        });
        
        // Close the notification after 5 seconds
        setTimeout(() => notification.close(), 5000);
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }, [permissionStatus, toast]);

  return {
    handleRefreshPermissions,
    handleSubscribe,
    sendTestNotification,
    permissionStatus
  };
};
