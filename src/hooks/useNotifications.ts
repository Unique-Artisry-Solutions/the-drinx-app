
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationsHook {
  notifications: NotificationItem[];
  unreadCount: number;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export function useNotifications(): NotificationsHook {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { toast } = useToast();

  const showToast = useCallback((
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const variant = type === 'error' ? 'destructive' : 'default';
    toast({
      title,
      description: message,
      variant
    });
  }, [toast]);

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show as toast
    showToast(notification.title, notification.message, notification.type);
  }, [showToast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    showToast,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
}
