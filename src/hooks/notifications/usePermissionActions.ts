
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function usePermissionActions() {
  const { toast } = useToast();

  const handleRefreshPermissions = useCallback(async (): Promise<void> => {
    if (!('Notification' in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Notifications are not supported in this browser"
      });
      return;
    }

    const currentPermission = Notification.permission;
    toast({
      title: "Permission Status",
      description: `Current notification permission: ${currentPermission}`
    });
  }, [toast]);

  return {
    handleRefreshPermissions
  };
}
