
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface NotificationPreference {
  id: string;
  user_id: string;
  category_id: string;
  channels: string[];
  is_enabled: boolean;
}

export interface Notification {
  id: string;
  recipient_id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category_id?: string;
  is_read: boolean;
  created_at: string;
  notification_categories?: {
    name: string;
    description: string;
  } | null;
}

export const useNotificationSystem = () => {
  const { toast } = useToast();

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updatePreferences = useCallback(async (
    categoryId: string,
    channels: string[],
    isEnabled: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ 
          channels,
          is_enabled: isEnabled
        })
        .eq('category_id', categoryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    markAsRead,
    updatePreferences,
  };
};
