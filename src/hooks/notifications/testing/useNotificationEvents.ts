
import { useCallback } from 'react';

export function useNotificationEvents() {
  const onShow = useCallback(() => {
    console.log('[NotificationEvents] Notification was shown');
  }, []);

  const onClick = useCallback((notification: Notification) => {
    console.log('[NotificationEvents] Notification was clicked:', notification);
  }, []);

  const onError = useCallback((error: Event) => {
    console.error('[NotificationEvents] Notification error:', error);
  }, []);

  const onClose = useCallback(() => {
    console.log('[NotificationEvents] Notification was closed');
  }, []);

  return {
    onShow,
    onClick,
    onError,
    onClose
  };
}
