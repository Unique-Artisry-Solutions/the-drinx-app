
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/notification';

interface RealTimeNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (notificationId: string) => void;
  clearAll: () => void;
}

const RealTimeNotificationContext = createContext<RealTimeNotificationContextType | undefined>(undefined);

export const useRealTimeNotifications = () => {
  const context = useContext(RealTimeNotificationContext);
  if (!context) {
    throw new Error('useRealTimeNotifications must be used within a RealTimeNotificationProvider');
  }
  return context;
};

interface RealTimeNotificationProviderProps {
  children: React.ReactNode;
}

export const RealTimeNotificationProvider: React.FC<RealTimeNotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsConnected(false);
      return;
    }

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${user.id}`
      }, (payload) => {
        const newNotification = payload.new as Notification;
        
        // Add to notifications list
        setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only latest 50
        setUnreadCount(prev => prev + 1);

        // Show toast notification for real-time updates
        if (newNotification.priority === 'urgent' || newNotification.priority === 'high') {
          toast({
            title: newNotification.title,
            description: newNotification.content,
            duration: newNotification.priority === 'urgent' ? 0 : 5000,
            variant: newNotification.priority === 'urgent' ? 'destructive' : 'default'
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${user.id}`
      }, (payload) => {
        const updatedNotification = payload.new as Notification;
        
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === updatedNotification.id 
              ? updatedNotification 
              : notification
          )
        );

        // Update unread count if notification was marked as read
        if (updatedNotification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          // Load initial notifications when connected
          loadInitialNotifications();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const loadInitialNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error loading initial notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state immediately for better UX
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive'
      });
    }
  };

  const clearAll = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear notifications',
        variant: 'destructive'
      });
    }
  };

  const value: RealTimeNotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    clearAll
  };

  return (
    <RealTimeNotificationContext.Provider value={value}>
      {children}
    </RealTimeNotificationContext.Provider>
  );
};
