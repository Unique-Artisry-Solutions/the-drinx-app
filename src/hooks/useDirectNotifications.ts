
import { useNotificationSupport } from './notifications/useNotificationSupport';
import { useNotificationPermission } from './notifications/useNotificationPermission';
import { useNotificationTesting } from './notifications/useNotificationTesting';
import { useNotificationReset } from './notifications/useNotificationReset';

export function useDirectNotifications() {
  const { isSupported, permissionStatus, lastCheck, checkPermission } = useNotificationSupport();
  const { isLoading: isLoadingPermission, error: permissionError, requestPermission } = useNotificationPermission();
  const { isLoading: isLoadingTest, error: testError, sendTestNotification } = useNotificationTesting();
  const { isLoading: isLoadingReset, error: resetError, resetPermissionState } = useNotificationReset();

  const isLoading = isLoadingPermission || isLoadingTest || isLoadingReset;
  const error = permissionError || testError || resetError;

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
