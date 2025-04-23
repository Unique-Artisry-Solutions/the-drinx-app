
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth';
import { useNotificationPreferences } from '@/hooks/notifications/useNotificationPreferences';
import { NotificationFormData } from '@/types/NotificationTypes';

const notificationFormSchema = z.object({
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(false),
  global_quiet_hours: z.object({
    enabled: z.boolean().default(false),
    start: z.string().default('22:00'),
    end: z.string().default('08:00')
  }),
  notification_categories: z.record(z.object({
    enabled: z.boolean().default(true),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    channels: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(false)
    }),
    sound: z.boolean().default(true),
    vibration: z.boolean().default(true),
    timeWindow: z.object({
      enabled: z.boolean().default(false),
      start: z.string().default('22:00'),
      end: z.string().default('08:00')
    })
  }))
});

export const useNotificationFormData = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { preferences, fetchPreferences, savePreferences } = useNotificationPreferences(user?.id);

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      email_notifications: true,
      push_notifications: false,
      global_quiet_hours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      notification_categories: {}
    }
  });

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user, fetchPreferences]);

  // When preferences are loaded, update the form
  useEffect(() => {
    if (!preferences) return;
    
    // Here we would map from database preferences to form model
    // This is a placeholder - actual implementation would depend on your data structure
    const notificationCategories: Record<string, any> = {};
    
    preferences.forEach(pref => {
      notificationCategories[pref.category_id] = {
        enabled: pref.is_enabled,
        priority: pref.metadata.priority || 'medium',
        channels: {
          email: pref.channels.includes('email'),
          push: pref.channels.includes('push')
        },
        sound: pref.metadata.sound,
        vibration: pref.metadata.vibration,
        timeWindow: {
          enabled: pref.metadata.timeWindowEnabled,
          start: pref.metadata.quietHoursStart,
          end: pref.metadata.quietHoursEnd
        }
      };
    });
    
    form.reset({
      email_notifications: true, // You might get these from user profile
      push_notifications: false, // You might get these from user profile
      global_quiet_hours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      notification_categories: notificationCategories
    });
  }, [preferences, form]);

  const handleSubmit = async (data: NotificationFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Here we would map from form model to database model and save
      // This is just a placeholder - you'll need to implement real saving logic
      
      // Success notification would be handled by the savePreferences method
    } catch (error) {
      console.error("Error saving notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleSubmit
  };
};
