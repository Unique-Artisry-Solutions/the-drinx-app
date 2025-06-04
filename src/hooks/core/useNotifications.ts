
import { useState, useEffect, useCallback } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  permissionStatus: NotificationPermission;
}

export interface NotificationActions {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  refresh: () => void;
  sendTestNotification: (category?: string) => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
}

export function useNotifications(): { state: NotificationState; actions: NotificationActions } {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    isSupported: 'Notification' in window,
    permissionStatus: 'Notification' in window ? Notification.permission : 'denied'
  });

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permissionStatus: permission }));
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }, []);

  const sendTestNotification = useCallback(async (category: string = 'test'): Promise<void> => {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    if (Notification.permission !== 'granted') {
      const permission = await requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }
    }

    try {
      new Notification(`Test Notification - ${category}`, {
        body: 'This is a test notification from the core notification system',
        icon: '/favicon.ico',
        tag: `test-${category}-${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }, [requestPermission]);

  const actions: NotificationActions = {
    markAsRead: (id: string) => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    },
    markAllAsRead: () => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    },
    removeNotification: (id: string) => {
      setState(prev => {
        const notification = prev.notifications.find(n => n.id === id);
        const unreadReduction = notification && !notification.read ? 1 : 0;
        return {
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== id),
          unreadCount: Math.max(0, prev.unreadCount - unreadReduction)
        };
      });
    },
    addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: NotificationItem = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false
      };
      setState(prev => ({
        ...prev,
        notifications: [newNotification, ...prev.notifications],
        unreadCount: prev.unreadCount + 1
      }));
    },
    refresh: () => {
      setState(prev => ({ ...prev, isLoading: true }));
      // Mock refresh - in real app would fetch from server
      setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      }, 500);
    },
    sendTestNotification,
    requestPermission
  };

  // Update permission status on mount and when visibility changes
  useEffect(() => {
    const updatePermissionStatus = () => {
      if ('Notification' in window) {
        setState(prev => ({ ...prev, permissionStatus: Notification.permission }));
      }
    };

    updatePermissionStatus();
    document.addEventListener('visibilitychange', updatePermissionStatus);
    
    return () => {
      document.removeEventListener('visibilitychange', updatePermissionStatus);
    };
  }, []);

  return { state, actions };
}
