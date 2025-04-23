
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface NotificationPreference {
  id?: string;
  user_id: string;
  category_id: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: {
    email: boolean;
    push: boolean;
  };
  sound: boolean;
  vibration: boolean;
  timeWindowEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface NotificationPreferencesData {
  notification_categories: {
    [key: string]: NotificationPreference;
  };
  email_notifications: boolean;
  push_notifications: boolean;
}

export const useNotificationPreferences = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferencesData | null>(null);
  const { toast } = useToast();

  const fetchPreferences = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Get user's general notification settings
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email_notifications, push_notifications')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Get notification categories
      const { data: categories, error: categoriesError } = await supabase
        .from('notification_categories')
        .select('id, name, description');

      if (categoriesError) throw categoriesError;

      // Get user's notification preferences
      const { data: userPrefs, error: prefsError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId);

      if (prefsError) throw prefsError;

      // Format data
      const formattedPreferences: NotificationPreferencesData = {
        email_notifications: profileData?.email_notifications ?? true,
        push_notifications: profileData?.push_notifications ?? false,
        notification_categories: {}
      };

      // Organize preferences by category
      categories?.forEach(category => {
        const userPref = userPrefs?.find(p => p.category_id === category.id);
        const channels = userPref?.channels || ['in_app'];
        
        formattedPreferences.notification_categories[category.id] = {
          user_id: userId,
          category_id: category.id,
          enabled: userPref?.is_enabled ?? true,
          priority: userPref?.metadata?.priority || 'medium',
          channels: {
            email: channels.includes('email'),
            push: channels.includes('push'),
          },
          sound: userPref?.metadata?.sound ?? true,
          vibration: userPref?.metadata?.vibration ?? true,
          timeWindowEnabled: userPref?.metadata?.timeWindowEnabled ?? false,
          quietHoursStart: userPref?.metadata?.quietHoursStart ?? "22", // 10 PM by default
          quietHoursEnd: userPref?.metadata?.quietHoursEnd ?? "8", // 8 AM by default
        };
      });

      setPreferences(formattedPreferences);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  const savePreferences = useCallback(async (data: NotificationPreferencesData) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Update profile settings
      await supabase
        .from('profiles')
        .update({
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications
        })
        .eq('id', userId);

      // Update category preferences
      for (const [categoryId, pref] of Object.entries(data.notification_categories)) {
        const channels: string[] = ['in_app'];
        if (pref.channels.email) channels.push('email');
        if (pref.channels.push) channels.push('push');
        
        const metadata = {
          priority: pref.priority,
          sound: pref.sound,
          vibration: pref.vibration,
          timeWindowEnabled: pref.timeWindowEnabled,
          quietHoursStart: pref.quietHoursStart,
          quietHoursEnd: pref.quietHoursEnd,
        };
        
        await supabase
          .from('notification_preferences')
          .upsert({
            user_id: userId,
            category_id: categoryId,
            is_enabled: pref.enabled,
            channels,
            metadata
          }, {
            onConflict: 'user_id,category_id'
          });
      }
      
      toast({
        title: 'Success',
        description: 'Notification preferences updated',
      });
      
      // Refresh preferences
      await fetchPreferences();
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, fetchPreferences]);

  // Initialize by fetching preferences
  const initializePreferences = useCallback(() => {
    if (userId && !preferences) {
      fetchPreferences();
    }
  }, [userId, preferences, fetchPreferences]);

  return {
    isLoading,
    preferences,
    fetchPreferences,
    savePreferences,
    initializePreferences
  };
};
