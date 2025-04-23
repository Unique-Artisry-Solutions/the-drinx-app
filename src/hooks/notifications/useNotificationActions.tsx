
import { useCallback } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useToast } from '@/hooks/use-toast';

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
      await subscribeToNotifications();
    }
  }, [subscribeToNotifications]);

  return {
    handleRefreshPermissions,
    handleSubscribe,
    permissionStatus
  };
};
