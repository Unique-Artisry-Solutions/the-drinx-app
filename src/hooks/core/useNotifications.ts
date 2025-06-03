
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  permissionStatus: 'default' | 'granted' | 'denied';
}

export interface NotificationActions {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendTestNotification: (type?: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  createNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => Promise<void>;
  requestPermission: () => Promise<void>;
  checkPermission: () => void;
  resetPermissionState: () => void;
}

export function useNotifications(): { state: NotificationState; actions: NotificationActions } {
  const { toast } = useToast();
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    isSupported: 'Notification' in window,
    permissionStatus: 'Notification' in window ? Notification.permission : 'denied'
  });

  const actions: NotificationActions = {
    fetchNotifications: useCallback(async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        // Mock notifications - replace with actual API call
        const mockNotifications: NotificationItem[] = [
          {
            id: '1',
            title: 'Welcome!',
            message: 'Welcome to the platform',
            type: 'info',
            read: false,
            createdAt: new Date()
          }
        ];
        
        setState(prev => ({
          ...prev,
          notifications: mockNotifications,
          unreadCount: mockNotifications.filter(n => !n.read).length,
          isLoading: false
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      }
    }, []),

    markAsRead: useCallback(async (id: string) => {
      try {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, prev.unreadCount - 1)
        }));
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to mark notification as read',
          variant: 'destructive',
        });
      }
    }, [toast]),

    markAllAsRead: useCallback(async () => {
      try {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
        toast({
          title: 'Success',
          description: 'All notifications marked as read',
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to mark all notifications as read',
          variant: 'destructive',
        });
      }
    }, [toast]),

    sendTestNotification: useCallback(async (type: string = 'info') => {
      try {
        const testNotification: NotificationItem = {
          id: Date.now().toString(),
          title: 'Test Notification',
          message: `This is a test ${type} notification`,
          type: type as any,
          read: false,
          createdAt: new Date()
        };
        
        setState(prev => ({
          ...prev,
          notifications: [testNotification, ...prev.notifications],
          unreadCount: prev.unreadCount + 1
        }));
        
        toast({
          title: 'Test notification sent',
          description: `${type} notification created`,
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to send test notification',
          variant: 'destructive',
        });
      }
    }, [toast]),

    deleteNotification: useCallback(async (id: string) => {
      try {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== id),
          unreadCount: prev.notifications.find(n => n.id === id && !n.read) 
            ? prev.unreadCount - 1 : prev.unreadCount
        }));
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete notification',
          variant: 'destructive',
        });
      }
    }, [toast]),

    createNotification: useCallback(async (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => {
      try {
        const newNotification: NotificationItem = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        
        setState(prev => ({
          ...prev,
          notifications: [newNotification, ...prev.notifications],
          unreadCount: notification.read ? prev.unreadCount : prev.unreadCount + 1
        }));
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to create notification',
          variant: 'destructive',
        });
      }
    }, [toast]),

    requestPermission: useCallback(async () => {
      try {
        if (!('Notification' in window)) {
          throw new Error('Notifications not supported');
        }
        
        const permission = await Notification.requestPermission();
        setState(prev => ({ ...prev, permissionStatus: permission }));
        
        toast({
          title: permission === 'granted' ? 'Permission granted' : 'Permission denied',
          description: `Notification permission is now ${permission}`,
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to request permission',
          variant: 'destructive',
        });
      }
    }, [toast]),

    checkPermission: useCallback(() => {
      if ('Notification' in window) {
        setState(prev => ({ 
          ...prev, 
          permissionStatus: Notification.permission,
          isSupported: true
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          permissionStatus: 'denied',
          isSupported: false
        }));
      }
    }, []),

    resetPermissionState: useCallback(() => {
      setState(prev => ({ 
        ...prev, 
        permissionStatus: 'Notification' in window ? Notification.permission : 'denied',
        error: null
      }));
    }, [])
  };

  useEffect(() => {
    actions.fetchNotifications();
    actions.checkPermission();
  }, []);

  return { state, actions };
}
