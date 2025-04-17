
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notification_categories?: {
    name: string;
    description: string;
  } | null;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.auth.session()?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'getNotifications',
          params: { userId: user.id }
        })
      });

      const { data, error } = await response.json();
      if (error) throw error;

      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.auth.session()?.access_token}`,
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

      const { error } = await response.json();
      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
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
    }
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    refetch: fetchNotifications
  };
};
