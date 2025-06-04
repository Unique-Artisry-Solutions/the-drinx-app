
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/notification';
import { useUserLocation } from '@/hooks/useUserLocation';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
  filterNotificationsByLocation: (radius?: number) => Notification[];
}

interface DirectNotificationActions {
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendTestNotification: () => Promise<void>;
}

interface UseNotificationsReturn extends NotificationState, NotificationActions, DirectNotificationActions {}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  
  const { user, session } = useAuth();
  const { toast } = useToast();
  const isInitialFetch = useRef(true);
  const { userLocation } = useUserLocation();

  const isSupported = 'Notification' in window;

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    if (!user || !session) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    if (!user || !session) return;

    try {
      // TODO: Replace with actual API call
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read"
      });
    }
  }, [user, session, toast]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user || !session) return;

    try {
      // TODO: Replace with actual API call
      await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read"
      });
    }
  }, [user, session, toast]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  }, [isSupported]);

  // Send test notification
  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!isSupported || Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    try {
      new Notification('Test Notification', {
        body: 'This is a test notification from the Swig app',
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
    } catch (err) {
      console.error('Error sending test notification:', err);
      throw err;
    }
  }, [isSupported]);

  // Filter notifications by location
  const filterNotificationsByLocation = useCallback((radius = 10) => {
    if (!userLocation || !notifications.length) {
      return notifications;
    }

    return notifications.filter(notification => {
      if (!notification.location_based || !notification.coordinates) {
        return true;
      }

      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        notification.coordinates.latitude,
        notification.coordinates.longitude
      );

      const targetRadius = notification.target_radius || radius;
      return distance <= targetRadius;
    });
  }, [userLocation, notifications]);

  // Helper function to calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  // Set up auto-refresh and service worker listeners
  useEffect(() => {
    let isMounted = true;
    const autoRefreshInterval = 30000;
    let refreshTimer: number | undefined;

    if (user && session) {
      if (isInitialFetch.current) {
        isInitialFetch.current = false;
        fetchNotifications();
      }
      
      refreshTimer = window.setInterval(() => {
        if (isMounted) fetchNotifications();
      }, autoRefreshInterval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      isInitialFetch.current = true;
    }

    return () => {
      isMounted = false;
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [user, session, fetchNotifications]);

  // Check permission status on mount
  useEffect(() => {
    if (isSupported) {
      setPermissionStatus(Notification.permission);
    }
  }, [isSupported]);

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    
    // Actions
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
    filterNotificationsByLocation,
    
    // Direct notification support
    isSupported,
    permissionStatus,
    requestPermission,
    sendTestNotification
  };
};
