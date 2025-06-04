
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
}

export interface NotificationActions {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  refresh: () => void;
}

export function useNotifications(): { state: NotificationState; actions: NotificationActions } {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null
  });

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
    }
  };

  return { state, actions };
}
