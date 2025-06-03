
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationActions {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export function useNotifications(): { state: NotificationState; actions: NotificationActions } {
  const { state: authState } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null
  });

  const refreshNotifications = useCallback(async () => {
    if (!authState.user) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call - replace with actual notification service
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockNotifications: NotificationItem[] = [
        {
          id: '1',
          title: 'Welcome!',
          content: 'Welcome to the platform',
          type: 'info',
          priority: 'medium',
          is_read: false,
          created_at: new Date().toISOString()
        }
      ];
      
      setState(prev => ({
        ...prev,
        notifications: mockNotifications,
        unreadCount: mockNotifications.filter(n => !n.is_read).length,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false
      }));
    }
  }, [authState.user]);

  const markAsRead = useCallback(async (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1)
    }));
  }, []);

  const markAllAsRead = useCallback(async () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, is_read: true })),
      unreadCount: 0
    }));
  }, []);

  const sendTestNotification = useCallback(async () => {
    if (!authState.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to send test notifications',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test notification',
          icon: '/favicon.ico'
        });
      }
      
      toast({
        title: 'Success',
        description: 'Test notification sent successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive'
      });
    }
  }, [authState.user, toast]);

  const deleteNotification = useCallback(async (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
      unreadCount: prev.notifications.find(n => n.id === id && !n.is_read) 
        ? prev.unreadCount - 1 
        : prev.unreadCount
    }));
  }, []);

  const actions: NotificationActions = {
    markAsRead,
    markAllAsRead,
    sendTestNotification,
    refreshNotifications,
    deleteNotification
  };

  // Auto-fetch notifications on mount
  useEffect(() => {
    if (authState.user) {
      refreshNotifications();
    }
  }, [authState.user, refreshNotifications]);

  return { state, actions };
}
