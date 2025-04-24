
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useAnalytics } from '@/hooks/useAnalytics';

export function useNotificationEvents() {
  const { user } = useAuth();
  const { track } = useAnalytics();

  const onShow = useCallback(() => {
    console.log('[NotificationEvents] Notification was shown');
    if (user) {
      track('notification_shown');
    }
  }, [user, track]);

  const onClick = useCallback((notification: Notification) => {
    console.log('[NotificationEvents] Notification was clicked:', notification);
    if (user) {
      track('notification_clicked');
    }
  }, [user, track]);

  const onError = useCallback((error: Event) => {
    console.error('[NotificationEvents] Notification error:', error);
    if (user) {
      track('notification_error');
    }
  }, [user, track]);

  const onClose = useCallback(() => {
    console.log('[NotificationEvents] Notification was closed');
    if (user) {
      track('notification_closed');
    }
  }, [user, track]);

  return {
    onShow,
    onClick,
    onError,
    onClose
  };
}
