
import { useCallback } from 'react';
import { Notification } from '@/types/notification';

export function usePushNotificationHandler({ setNotifications, setUnreadCount, toast }: {
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  toast: any;
}) {
  const addPushNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    toast({
      title: notification.title,
      description: notification.content,
      duration: 5000
    });
  }, [setNotifications, setUnreadCount, toast]);

  return { addPushNotification };
}
