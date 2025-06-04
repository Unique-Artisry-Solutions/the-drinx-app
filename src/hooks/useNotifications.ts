
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { Notification as NotificationType } from '@/types/notification';

interface NotificationState {
  notifications: NotificationType[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  permissionStatus: NotificationPermission;
}

interface NotificationActions {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<NotificationType, 'id' | 'timestamp' | 'created_at' | 'read' | 'is_read' | 'content'>) => void;
  clearAll: () => void;
  refetch: () => Promise<void>;
  sendTestNotification: (type: string) => Promise<void>;
}

interface UseNotificationsReturn extends NotificationState, NotificationActions {
  state: NotificationState;
  actions: NotificationActions;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { track } = useAnalytics();

  // Check browser support and permission
  const isSupported = 'Notification' in window;
  const permissionStatus = isSupported ? Notification.permission : 'denied' as NotificationPermission;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true, is_read: true }
          : notification
      )
    );
    track('notification_read', { notification_id: id });
  }, [track]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true, is_read: true }))
    );
    track('notifications_mark_all_read');
  }, [track]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    track('notification_removed', { notification_id: id });
  }, [track]);

  const addNotification = useCallback((notification: Omit<NotificationType, 'id' | 'timestamp' | 'created_at' | 'read' | 'is_read' | 'content'>) => {
    const now = Date.now();
    const newNotification: NotificationType = {
      ...notification,
      id: now.toString(),
      timestamp: now,
      created_at: new Date(now).toISOString(),
      read: false,
      is_read: false,
      content: notification.message // Automatically set content from message
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

  const state: NotificationState = {
    notifications,
    unreadCount,
    isLoading,
    error,
    isSupported,
    permissionStatus
  };

  const actions: NotificationActions = {
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    clearAll,
    refetch,
    sendTestNotification
  };

  return {
    ...state,
    ...actions,
    state,
    actions
  };
};
