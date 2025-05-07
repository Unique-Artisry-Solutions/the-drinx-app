import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { safeJsonToRecord } from '@/utils/typeGuards';
import { NotificationChannel, NotificationPriority } from '@/types/CampaignSegmentTypes';
import { convertToNotificationChannels, validateNotificationPriority } from '@/services/typeAdapterService';

export interface Notification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  priority: NotificationPriority;
  category_id?: string;
  recipient_id: string;
  metadata?: Record<string, any>;
}

interface NotificationCategory {
  id: string;
  name: string;
  description?: string;
}

interface NotificationPreference {
  id: string;
  category_id: string;
  is_enabled: boolean;
  channels: NotificationChannel[];
}

export const useNotificationSystem = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [categories, setCategories] = useState<NotificationCategory[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Process notifications to handle JSON metadata
      const processedNotifications = data.map(notification => {
        // Parse metadata if it exists and is valid
        let parsedMetadata = {};
        if (notification.metadata) {
          parsedMetadata = safeJsonToRecord(notification.metadata, {});
        }

        return {
          ...notification,
          // Ensure priority is a valid value
          priority: validateNotificationPriority(notification.priority),
          // Use parsed metadata
          metadata: parsedMetadata
        };
      });

      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.is_read).length);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notification_categories')
        .select('*');

      if (error) throw error;
      
      setCategories(data);
    } catch (error: any) {
      console.error('Error loading notification categories:', error);
    }
  }, []);

  const loadPreferences = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      setPreferences(data);
    } catch (error: any) {
      console.error('Error loading notification preferences:', error);
    }
  }, [userId]);

  // Initial data loading
  useEffect(() => {
    loadCategories();
    if (userId) {
      loadNotifications();
      loadPreferences();
      
      // Set up real-time subscription for new notifications
      const subscription = supabase
        .channel('notifications-channel')
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `recipient_id=eq.${userId}`
          },
          (payload) => {
            const newNotification = {
              ...payload.new as Notification,
              // Parse metadata if it exists
              metadata: safeJsonToRecord(payload.new.metadata)
            };
            
            // Update notifications state
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.content,
            });
          }
        )
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId, loadNotifications, loadCategories, loadPreferences, toast]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId || notifications.filter(n => !n.is_read).length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      const removedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (removedNotification && !removedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error('Error deleting notification:', error);
    }
  };

  const updatePreference = async (categoryId: string, isEnabled: boolean, channels: string[]) => {
    if (!userId) return;
    
    // Convert channels to valid notification channels
    const validChannels = convertToNotificationChannels(channels);
    
    try {
      const existingPref = preferences.find(p => p.category_id === categoryId);
      
      if (existingPref) {
        // Update existing preference
        const { error } = await supabase
          .from('notification_preferences')
          .update({ 
            is_enabled: isEnabled, 
            channels: validChannels 
          })
          .eq('id', existingPref.id);
          
        if (error) throw error;
      } else {
        // Create new preference
        const { error } = await supabase
          .from('notification_preferences')
          .insert({
            user_id: userId,
            category_id: categoryId,
            is_enabled: isEnabled,
            channels: validChannels
          });
          
        if (error) throw error;
      }
      
      // Refresh preferences
      loadPreferences();
    } catch (error: any) {
      console.error('Error updating notification preference:', error);
    }
  };

  const sendNotification = async (
    recipientId: string, 
    title: string, 
    content: string, 
    options: {
      priority?: NotificationPriority;
      categoryId?: string;
      metadata?: Record<string, any>;
    } = {}
  ) => {
    try {
      // Validate the priority
      const validPriority = validateNotificationPriority(options.priority || 'medium');
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          title,
          content,
          priority: validPriority,
          category_id: options.categoryId,
          metadata: options.metadata ? JSON.stringify(options.metadata) : null
        });

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  const broadcastNotification = async (
    title: string, 
    content: string, 
    options: {
      priority?: NotificationPriority;
      categoryId?: string;
      metadata?: Record<string, any>;
      recipientFilter?: string; // SQL where clause for recipients, e.g. "user_type = 'admin'"
    } = {}
  ) => {
    try {
      // This would typically call an edge function or server API for broadcasting
      // For demo purposes, we'll just log it
      console.log('Broadcasting notification:', { title, content, options });
      return true;
    } catch (error: any) {
      console.error('Error broadcasting notification:', error);
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    categories,
    preferences,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreference,
    sendNotification,
    broadcastNotification,
    refresh: loadNotifications
  };
};
