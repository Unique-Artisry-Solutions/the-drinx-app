
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth';
import { useNotificationPreferences } from '@/hooks/notifications/useNotificationPreferences';
import { NotificationFormData, NotificationMetadata, NotificationCategory } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
      notification_categories: {
        'system-updates': {
          enabled: true,
          priority: 'high',
          channels: { email: true, push: true },
          sound: true,
          vibration: true,
          timeWindow: {
            enabled: false,
            start: '22:00',
            end: '08:00'
          }
        },
        'bar-crawl': {
          enabled: true,
          priority: 'medium',
          channels: { email: true, push: true },
          sound: true,
          vibration: true,
          timeWindow: {
            enabled: false,
            start: '22:00',
            end: '08:00'
          }
        },
        'establishment': {
          enabled: true,
          priority: 'medium',
          channels: { email: true, push: false },
          sound: true,
          vibration: true,
          timeWindow: {
            enabled: false,
            start: '22:00',
            end: '08:00'
          }
        },
        'promotions': {
          enabled: true,
          priority: 'low',
          channels: { email: true, push: false },
          sound: false,
          vibration: false,
          timeWindow: {
            enabled: false,
            start: '22:00',
            end: '08:00'
          }
        }
      }
    }
  });

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user, fetchPreferences]);

  useEffect(() => {
    if (!preferences) return;
    
    const notificationCategories: Record<string, NotificationCategory> = {};
    
    ['system-updates', 'bar-crawl', 'establishment', 'promotions'].forEach(categoryId => {
      notificationCategories[categoryId] = form.getValues(`notification_categories.${categoryId}`);
    });
    
    preferences.forEach(pref => {
      const metadata = (pref.metadata || {}) as NotificationMetadata;
      
      notificationCategories[pref.category_id] = {
        enabled: pref.is_enabled,
        priority: metadata.priority || 'medium',
        channels: {
          email: pref.channels.includes('email'),
          push: pref.channels.includes('push')
        },
        sound: metadata.sound ?? true,
        vibration: metadata.vibration ?? true,
        timeWindow: {
          enabled: metadata.timeWindowEnabled ?? false,
          start: metadata.quietHoursStart || '22:00',
          end: metadata.quietHoursEnd || '08:00'
        }
      };
    });
    
    form.reset({
      email_notifications: true,
      push_notifications: false,
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
      const savePromises = Object.entries(data.notification_categories).map(([categoryId, prefs]) => {
        const channels: ('email' | 'push' | 'in_app')[] = [];
        if (prefs.channels.email) channels.push('email');
        if (prefs.channels.push) channels.push('push');
        channels.push('in_app');
        
        const metadata: NotificationMetadata = {
          priority: prefs.priority,
          sound: prefs.sound,
          vibration: prefs.vibration,
          timeWindowEnabled: prefs.timeWindow.enabled,
          quietHoursStart: prefs.timeWindow.start,
          quietHoursEnd: prefs.timeWindow.end
        };
        
        return savePreferences(categoryId, channels, prefs.enabled, metadata);
      });
      
      await Promise.all(savePromises);
      
      toast({
        title: "Success",
        description: "Notification preferences saved successfully",
      });
      
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
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
