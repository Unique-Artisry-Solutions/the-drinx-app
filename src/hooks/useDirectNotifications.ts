
// Legacy hook - redirects to core useNotifications hook for backward compatibility
// This file is deprecated and will be removed in a future version
import { useNotifications } from './core/useNotifications';

/**
 * @deprecated Use useNotifications from '@/hooks/core' instead
 * This hook is maintained for backward compatibility only
 */
export function useDirectNotifications() {
  console.warn('useDirectNotifications is deprecated. Use useNotifications from @/hooks/core instead.');
  
  const { state, actions } = useNotifications();

  return {
    isSupported: state.isSupported,
    permissionStatus: state.permissionStatus,
    lastCheck: new Date(), // Return Date object for compatibility
    isLoading: state.isLoading,
    error: state.error,
    requestPermission: actions.requestPermission,
    checkPermission: actions.checkPermission,
    sendTestNotification: actions.sendTestNotification,
    resetPermissionState: actions.resetPermissionState
  };
}
