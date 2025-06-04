
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { Notification as NotificationType } from '@/types/notification';

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
  refetch: () => Promise<void>;
  sendTestNotification: (type: string) => Promise<void>;
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

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock refetch - in real app would fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendTestNotification = useCallback(async (type: string) => {
    setIsLoading(true);
    try {
      const testNotification = {
        title: `Test ${type} Notification`,
        message: `This is a test notification of type: ${type}`,
        type: type as 'success' | 'error' | 'warning' | 'info',
        priority: 'medium' as const
      };
      
      addNotification(testNotification);
      
      toast({
        title: "Test Notification Sent",
        description: `${type} notification sent successfully`
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send test notification');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, toast]);

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
    clearAll,
    refetch,
    sendTestNotification
  };
};
