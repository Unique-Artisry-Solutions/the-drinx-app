
import { useCallback } from 'react';

export function useEnvironmentInfo() {
  const logEnvironmentInfo = useCallback(() => {
    console.log('[EnvironmentInfo] Browser:', navigator.userAgent);
    console.log('[EnvironmentInfo] Notification permission:', Notification.permission);
    console.log('[EnvironmentInfo] Service Worker support:', 'serviceWorker' in navigator);
    console.log('[EnvironmentInfo] Push API support:', 'PushManager' in window);
  }, []);

  return {
    logEnvironmentInfo
  };
}
