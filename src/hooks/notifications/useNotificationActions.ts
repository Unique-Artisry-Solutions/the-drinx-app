
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/NotificationTypes';

interface ActionsOptions {
  userId: string | undefined;
  accessToken: string | undefined;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  toast: any;
}

export function useNotificationActions({
  userId,
  accessToken,
  notifications,
  setNotifications,
  setUnreadCount,
  toast
}: ActionsOptions) {
  const markAsRead = async (notificationId: string) => {
    if (!userId || !accessToken) return;

    try {
      const { error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'updateNotification',
          params: { notificationId, isRead: true }
        }
      });
      if (error) throw new Error(error.message || 'Failed to update notification');
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    if (!userId || !accessToken || notifications.length === 0) return;
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      if (unreadIds.length === 0) return;
      const { error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'markAllAsRead',
          params: { userId }
        }
      });
      if (error) throw new Error(error.message || 'Failed to mark all notifications as read');

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({
        title: "Success", 
        description: `Marked ${unreadIds.length} notifications as read`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive"
      });
    }
  };

  return { markAsRead, markAllAsRead };
}

