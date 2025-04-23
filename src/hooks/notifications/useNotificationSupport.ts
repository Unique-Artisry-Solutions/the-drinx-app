
import { useState, useEffect } from 'react';

export function useNotificationSupport() {
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const hasNotificationSupport = 'Notification' in window;
    setIsSupported(hasNotificationSupport);

    if (hasNotificationSupport) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const checkPermission = () => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      console.log('[NotificationSupport] Current notification permission:', currentPermission);
      setPermissionStatus(currentPermission);
      setLastCheck(new Date());
      return currentPermission;
    }
    return null;
  };

  return {
    isSupported,
    permissionStatus,
    lastCheck,
    checkPermission
  };
}
