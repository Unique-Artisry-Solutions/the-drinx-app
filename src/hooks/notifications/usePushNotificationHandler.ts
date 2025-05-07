
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
    
    // Determine priority based on notification priority
    const priority = notification.priority || 'medium';
    
    toast({
      title: notification.title,
      description: notification.content,
      duration: priority === 'urgent' ? 0 : 5000, // Urgent notifications stay until dismissed
      priority: priority,
      variant: notification.metadata?.type === 'error' ? 'destructive' : 
               notification.metadata?.type === 'success' ? 'success' : 
               notification.metadata?.type === 'warning' ? 'warning' : 'info'
    });
  }, [setNotifications, setUnreadCount, toast]);

  return { addPushNotification };
}
