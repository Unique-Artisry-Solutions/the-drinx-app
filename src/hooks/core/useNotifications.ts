
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
  permissionStatus: NotificationPermission;
  isSupported: boolean;
}

export interface NotificationActions {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  requestPermission: () => Promise<void>;
  checkPermission: () => void;
  resetPermissionState: () => Promise<void>;
}

export function useNotifications(): { state: NotificationState; actions: NotificationActions } {
  const { state: authState } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    permissionStatus: typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'denied',
    isSupported: typeof window !== 'undefined' && 'Notification' in window
  });

  const checkPermission = useCallback(() => {
    if (state.isSupported) {
      setState(prev => ({
        ...prev,
        permissionStatus: Notification.permission
      }));
    }
  }, [state.isSupported]);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      toast({
        title: 'Not Supported',
        description: 'Browser notifications are not supported',
        variant: 'destructive'
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permissionStatus: permission }));
      
      if (permission === 'granted') {
        toast({
          title: 'Success',
          description: 'Notification permission granted'
        });
      } else {
        toast({
          title: 'Permission Denied',
          description: 'Notification permission was denied',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request notification permission',
        variant: 'destructive'
      });
    }
  }, [state.isSupported, toast]);

  const resetPermissionState = useCallback(async () => {
    // Note: Cannot programmatically reset permission, user must do it manually
    toast({
      title: 'Reset Instructions',
      description: 'Please reset notification permissions manually in your browser settings',
      variant: 'info'
    });
  }, [toast]);

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

    if (!state.isSupported) {
      toast({
        title: 'Not Supported',
        description: 'Browser notifications are not supported',
        variant: 'destructive'
      });
      return;
    }

    if (state.permissionStatus !== 'granted') {
      toast({
        title: 'Permission Required',
        description: 'Please grant notification permission first',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Show browser notification
      new Notification('Test Notification', {
        body: 'This is a test notification',
        icon: '/favicon.ico',
        tag: `test-${Date.now()}`
      });
      
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
  }, [authState.user, state.isSupported, state.permissionStatus, toast]);

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
    deleteNotification,
    requestPermission,
    checkPermission,
    resetPermissionState
  };

  // Auto-fetch notifications and check permission on mount
  useEffect(() => {
    checkPermission();
    if (authState.user) {
      refreshNotifications();
    }
  }, [authState.user, refreshNotifications, checkPermission]);

  return { state, actions };
}
