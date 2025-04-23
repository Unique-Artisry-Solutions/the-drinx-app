
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/NotificationTypes';
import { debouncedToast } from '@/utils/debouncedToast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();
  const isInitialFetch = useRef(true);
  const fetchingRef = useRef(false);

  // Add new push notification from service worker
  const addPushNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification when receiving a push in the background
    toast({
      title: notification.title,
      description: notification.content,
      duration: 5000
    });
  }, [toast]);

  const fetchNotifications = async () => {
    // Don't fetch if we're already fetching or don't have auth
    if (fetchingRef.current || !user?.id || !session?.access_token) {
      setIsLoading(false);
      if (!user?.id || !session?.access_token) {
        setError("Please log in to view notifications");
      }
      return;
    }

    fetchingRef.current = true;
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        setIsLoading(true);
        setError(null);

        // Use the supabase function invoke method instead of raw fetch
        const { data, error } = await supabase.functions.invoke('notifications', {
          body: {
            action: 'getNotifications',
            params: { userId: user.id }
          }
        });

        if (error) {
          throw new Error(error.message || 'Failed to fetch notifications');
        }
        
        const notificationsArray = data?.data && Array.isArray(data.data) ? data.data : [];
        
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n: Notification) => !n.is_read).length);
        fetchingRef.current = false;
        setIsLoading(false);
        return;

      } catch (error: any) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        attempt++;
        
        if (attempt === maxRetries) {
          debouncedToast.error(
            "Notification Error",
            "Unable to fetch notifications. Will retry automatically."
          );
          setError(error.message || 'Failed to fetch notifications');
          setIsLoading(false);
          fetchingRef.current = false;
        }
        
        // Add exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 5000)));
      }
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.id || !session?.access_token) return;

    try {
      // Use the supabase function invoke method instead of raw fetch
      const { data, error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'updateNotification',
          params: {
            notificationId,
            isRead: true
          }
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to update notification');
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id || !session?.access_token || notifications.length === 0) return;
    
    try {
      // Mark all notifications as read
      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);
        
      if (unreadIds.length === 0) return;
      
      const { error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'markAllAsRead',
          params: { userId: user.id }
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to mark all notifications as read');
      }

      // Update the local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      
      toast({
        title: "Success", 
        description: `Marked ${unreadIds.length} notifications as read`
      });
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const autoRefreshInterval = 30000; // 30 seconds
    let refreshTimer: number | undefined;
    let swMessageHandler: ((event: MessageEvent) => void) | null = null;

    const setupNotificationFetch = () => {
      if (user && session) {
        if (isInitialFetch.current) {
          isInitialFetch.current = false;
          fetchNotifications();
        }
        
        // Set up auto-refresh
        refreshTimer = window.setInterval(() => {
          if (isMounted && !fetchingRef.current) {
            fetchNotifications();
          }
        }, autoRefreshInterval);

        // Prepare a handler for service worker push notification
        swMessageHandler = (event: MessageEvent) => {
          if (
            event.data && 
            event.data.type === 'PUSH_NOTIFICATION_RECEIVED' &&
            event.data.notification
          ) {
            console.log('Received push notification from service worker:', event.data.notification);
            // Add notification to local state so it shows instantly in the popover
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
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
      // Properly clean up service worker listener if it was assigned
      if (swMessageHandler) {
        navigator.serviceWorker.removeEventListener('message', swMessageHandler);
      }
    };
  }, [user, session, addPushNotification]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};

