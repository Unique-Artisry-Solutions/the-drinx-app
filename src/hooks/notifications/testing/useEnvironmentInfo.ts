
import { useCallback } from 'react';
import { debugLogger } from '@/utils/debugLogger';

export function useEnvironmentInfo() {
  const logEnvironmentInfo = useCallback(() => {
    debugLogger.group('notifications', 'Environment Information');
    debugLogger.info('notifications', 'Browser: ' + navigator.userAgent);
    debugLogger.info('notifications', 'Notification permission: ' + Notification.permission);
    debugLogger.info('notifications', 'Service Worker support: ' + ('serviceWorker' in navigator));
    debugLogger.info('notifications', 'Push API support: ' + ('PushManager' in window));
    debugLogger.groupEnd('notifications');
  }, []);

  return {
    logEnvironmentInfo
  };
}
