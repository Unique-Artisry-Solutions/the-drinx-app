
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/NotificationTypes';

import { useNotificationFetcher } from './notifications/useNotificationFetcher';
import { useNotificationMarking } from './notifications/useNotificationMarking';
import { usePermissionActions } from './notifications/usePermissionActions';
import { usePushNotificationHandler } from './notifications/usePushNotificationHandler';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();
  const isInitialFetch = useRef(true);

  const { fetchNotifications } = useNotificationFetcher({
    userId: user?.id,
    accessToken: session?.access_token,
    setNotifications,
    setUnreadCount,
    setIsLoading,
    setError
  });

  const { markAsRead, markAllAsRead } = useNotificationMarking({
    userId: user?.id,
    accessToken: session?.access_token,
    notifications,
    setNotifications,
    setUnreadCount,
    toast
  });

  const { handleRefreshPermissions } = usePermissionActions();

  const { addPushNotification } = usePushNotificationHandler({
    setNotifications,
    setUnreadCount,
    toast
  });

  useEffect(() => {
    let isMounted = true;
    const autoRefreshInterval = 30000;
    let refreshTimer: number | undefined;
    let swMessageHandler: ((event: MessageEvent) => void) | null = null;

    const setupNotificationFetch = () => {
      if (user && session) {
        if (isInitialFetch.current) {
          isInitialFetch.current = false;
          fetchNotifications();
        }
        refreshTimer = window.setInterval(() => {
          if (isMounted) fetchNotifications();
        }, autoRefreshInterval);

        swMessageHandler = (event: MessageEvent) => {
          if (
            event.data && 
            event.data.type === 'PUSH_NOTIFICATION_RECEIVED' &&
            event.data.notification
          ) {
            addPushNotification(event.data.notification);
          }
        };
        navigator.serviceWorker.addEventListener('message', swMessageHandler);
      } else {
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        isInitialFetch.current = true;
      }
    };

    setupNotificationFetch();
    return () => {
      isMounted = false;
      if (refreshTimer) clearInterval(refreshTimer);
      if (swMessageHandler) {
        navigator.serviceWorker.removeEventListener('message', swMessageHandler);
      }
    };
  }, [user, session, addPushNotification, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
