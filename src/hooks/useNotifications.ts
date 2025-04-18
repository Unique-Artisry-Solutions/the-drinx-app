
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/NotificationTypes';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Use the full URL including the project ID
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvifibvzwunnpcsihpxq.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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

      // Handle empty notifications gracefully
      const notificationsArray = Array.isArray(data) ? data : [];
      setNotifications(notificationsArray);
      setUnreadCount(notificationsArray.filter((n: Notification) => !n.is_read).length);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setError(error.message || 'Failed to load notifications');
      
      // Don't show toast for no notifications
      if (!error.message?.includes('No notifications')) {
        toast({
          title: "Notification Error",
          description: error.message || "Failed to load notifications",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error('No access token available');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvifibvzwunnpcsihpxq.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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

      const { error } = await response.json();
      if (error) throw error;

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
    if (user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    refetch: fetchNotifications
  };
};
