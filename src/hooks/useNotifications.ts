
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { Notification as NotificationType } from '@/types/notifications';

interface NotificationState {
  notifications: NotificationType[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<NotificationType, 'id' | 'timestamp'>) => void;
  clearAll: () => void;
}

export const useNotifications = (): NotificationState & NotificationActions => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { track } = useAnalytics();

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    track('notification_read', { notification_id: id });
  }, [track]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    track('notifications_mark_all_read');
  }, [track]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    track('notification_removed', { notification_id: id });
  }, [track]);

  const addNotification = useCallback((notification: Omit<NotificationType, 'id' | 'timestamp'>) => {
    const newNotification: NotificationType = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for high priority notifications
    if (notification.priority === 'high') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default'
      });
    }
    
    track('notification_added', { 
      type: notification.type,
      priority: notification.priority 
    });
  }, [toast, track]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    track('notifications_cleared');
  }, [track]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    clearAll
  };
};
