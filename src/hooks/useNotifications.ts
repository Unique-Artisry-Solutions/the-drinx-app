import { useState, useEffect } from 'react';
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

  const fetchNotifications = async () => {
    if (!user?.id || !session?.access_token) {
      setIsLoading(false);
      setError("Please log in to view notifications");
      return;
    }

    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        setIsLoading(true);
        setError(null);

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvifibvzwunnpcsihpxq.supabase.co';
        const response = await fetch(`${supabaseUrl}/functions/v1/notifications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'getNotifications',
            params: { userId: user.id }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server responded with ${response.status}`);
        }

        const { data, error } = await response.json();
        if (error) throw error;

        const notificationsArray = Array.isArray(data) ? data : [];
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n: Notification) => !n.is_read).length);
        return;

      } catch (error: any) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        attempt++;
        
        if (attempt === maxRetries) {
          setError(error.message || 'Failed to load notifications');
          if (!error.message?.includes('No notifications')) {
            debouncedToast.error(
              "Notification Error",
              "Unable to fetch notifications. Will retry automatically."
            );
          }
        }
        
        // Add exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 5000)));
      } finally {
        if (attempt === maxRetries) setIsLoading(false);
      }
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.id || !session?.access_token) return;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvifibvzwunnpcsihpxq.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'updateNotification',
          params: {
            notificationId,
            isRead: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with ${response.status}`);
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
    if (user && session) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
    }
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
