
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
              { debounceMs: 5000 }
            );
          } else {
            debouncedToast.error(
              "Error",
              `Failed to enable notifications: ${error.message}`,
              { debounceMs: 5000 }
            );
          }
        }
      }
    }
  }, [subscribeToNotifications, toast]);

  return {
    handleRefreshPermissions,
    handleSubscribe,
    permissionStatus
  };
};
