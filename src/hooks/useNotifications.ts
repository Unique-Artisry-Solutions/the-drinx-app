
import { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    const autoRefreshInterval = 30000; // 30 seconds
    let refreshTimer: number;

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
    };
  }, [user, session]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    refetch: fetchNotifications
  };
};
