
import { useCallback } from 'react';

interface NotificationEventHandlers {
  onShow: () => void;
  onClick: (notification: Notification) => void;
  onError: (event: Event) => void;
  onClose: () => void;
}

export function useNotificationEvents(): NotificationEventHandlers {
  const onShow = useCallback(() => {
    console.log('[NotificationTesting] Notification "show" event triggered.');
  }, []);

  const onClick = useCallback((notification: Notification) => {
    console.log('[NotificationTesting] Notification "click" event triggered.');
    window.focus();
    notification.close();
  }, []);

  const onError = useCallback((event: Event) => {
    console.error('[NotificationTesting] Notification "error" event:', event);
  }, []);

  const onClose = useCallback(() => {
    console.log('[NotificationTesting] Notification "close" event triggered.');
  }, []);

  return { onShow, onClick, onError, onClose };
}
