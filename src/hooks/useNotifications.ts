
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/NotificationTypes';
import { useUserLocation } from '@/hooks/useUserLocation';

import { useNotificationFetcher } from './notifications/useNotificationFetcher';
import { useNotificationMarking } from './notifications/useNotificationMarking';
import { usePermissionActions } from './notifications/usePermissionActions';
import { usePushNotificationHandler } from './notifications/usePushNotificationHandler';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();
  const isInitialFetch = useRef(true);
  const { userLocation } = useUserLocation();

  const { fetchNotifications } = useNotificationFetcher({
    userId: user?.id,
    accessToken: session?.access_token,
    setNotifications,
    setUnreadCount,
    setIsLoading,
    setError
  });

  const { markAsRead, markAllAsRead } = useNotificationMarking({
    userId: user?.id,
    accessToken: session?.access_token,
    notifications,
    setNotifications,
    setUnreadCount,
    toast
  });

  const { handleRefreshPermissions } = usePermissionActions();

  const { addPushNotification } = usePushNotificationHandler({
    setNotifications,
    setUnreadCount,
    toast
  });

  // Filter notifications based on location
  const filterNotificationsByLocation = useCallback((radius?: number) => {
    if (!userLocation || !notifications || notifications.length === 0) {
      return notifications;
    }

    return notifications.filter(notification => {
      // If the notification is not location-based, include it
      if (!notification.location_based || !notification.coordinates) {
        return true;
      }

      // Calculate distance between user and notification target
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        notification.coordinates.latitude,
        notification.coordinates.longitude
      );

      // Check if user is within the notification's target radius
      // If target_radius is not set, use the provided radius parameter or default to 10 miles
      const targetRadius = notification.target_radius || radius || 10;
      return distance <= targetRadius;
    });
  }, [userLocation, notifications]);

  // Helper function to calculate distance between two points using the Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  useEffect(() => {
    let isMounted = true;
    const autoRefreshInterval = 30000;
    let refreshTimer: number | undefined;
    let swMessageHandler: ((event: MessageEvent) => void) | null = null;

    const setupNotificationFetch = () => {
      if (user && session) {
        if (isInitialFetch.current) {
          isInitialFetch.current = false;
          fetchNotifications();
        }
        refreshTimer = window.setInterval(() => {
          if (isMounted) fetchNotifications();
        }, autoRefreshInterval);

        swMessageHandler = (event: MessageEvent) => {
          if (
            event.data && 
            event.data.type === 'PUSH_NOTIFICATION_RECEIVED' &&
            event.data.notification
          ) {
            addPushNotification(event.data.notification);
          }
        };
        navigator.serviceWorker.addEventListener('message', swMessageHandler);
      } else {
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        isInitialFetch.current = true;
      }
    };

    setupNotificationFetch();
    return () => {
      isMounted = false;
      if (refreshTimer) clearInterval(refreshTimer);
      if (swMessageHandler) {
        navigator.serviceWorker.removeEventListener('message', swMessageHandler);
      }
    };
  }, [user, session, addPushNotification, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
    filterNotificationsByLocation,
  };
};
