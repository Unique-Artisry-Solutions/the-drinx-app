import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/notification';

interface NotificationMarkingParams {
  userId?: string;
  accessToken?: string;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  toast: ReturnType<typeof useToast>['toast'];
}

export function useNotificationMarking({
  userId,
  accessToken,
  notifications,
  setNotifications,
  setUnreadCount,
  toast
}: NotificationMarkingParams) {
  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!userId || !accessToken) return;
    
    try {
      // Update local state immediately for responsive UI
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Here you would typically make an API call to update the server
      console.log(`Marking notification ${notificationId} as read`);
      // Example: await api.markNotificationAsRead(notificationId, accessToken);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  }, [userId, accessToken, setNotifications, setUnreadCount, toast]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!userId || !accessToken) return;
    
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      setUnreadCount(0);
      
      // Here you would make an API call to update the server
      console.log('Marking all notifications as read');
      // Example: await api.markAllNotificationsAsRead(userId, accessToken);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  }, [userId, accessToken, setNotifications, setUnreadCount, toast]);

  return {
    markAsRead,
    markAllAsRead
  };
}
