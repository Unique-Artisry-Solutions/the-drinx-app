import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  display_name: z.string().min(2, { message: "Display name must be at least 2 characters." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z.string().max(160, { message: "Bio must be less than 160 characters." }).optional(),
  
  theme_preference: z.enum(['light', 'dark', 'system']).default('system'),
  color_mode: z.enum(['default', 'monochrome']).default('default'),
  accent_color: z.string().default('blue'),
  
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(false),
  notification_categories: z.object({
    'system-updates': z.object({
      enabled: z.boolean().default(true),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
      channels: z.object({
        email: z.boolean().default(true),
        push: z.boolean().default(true),
      }).default({ email: true, push: true }),
      sound: z.boolean().default(true),
      vibration: z.boolean().default(true),
      timeWindowEnabled: z.boolean().default(false),
      quietHoursStart: z.string().default('22'),
      quietHoursEnd: z.string().default('7'),
    }).default({
      enabled: true,
      priority: 'medium',
      channels: { email: true, push: true },
      sound: true,
      vibration: true,
      timeWindowEnabled: false,
      quietHoursStart: '22',
      quietHoursEnd: '7',
    }),
    'bar-crawl': z.object({
      enabled: z.boolean().default(true),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('high'),
      channels: z.object({
        email: z.boolean().default(true),
        push: z.boolean().default(true),
      }).default({ email: true, push: true }),
      sound: z.boolean().default(true),
      vibration: z.boolean().default(true),
      timeWindowEnabled: z.boolean().default(false),
      quietHoursStart: z.string().default('22'),
      quietHoursEnd: z.string().default('7'),
    }).default({
      enabled: true,
      priority: 'high',
      channels: { email: true, push: true },
      sound: true,
      vibration: true,
      timeWindowEnabled: false,
      quietHoursStart: '22',
      quietHoursEnd: '7',
    }),
    'establishment': z.object({
      enabled: z.boolean().default(true),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('low'),
      channels: z.object({
        email: z.boolean().default(false),
        push: z.boolean().default(true),
      }).default({ email: false, push: true }),
      sound: z.boolean().default(false),
      vibration: z.boolean().default(true),
      timeWindowEnabled: z.boolean().default(false),
      quietHoursStart: z.string().default('22'),
      quietHoursEnd: z.string().default('7'),
    }).default({
      enabled: true,
      priority: 'low',
      channels: { email: false, push: true },
      sound: false,
      vibration: true,
      timeWindowEnabled: false,
      quietHoursStart: '22',
      quietHoursEnd: '7',
    }),
    'promotions': z.object({
      enabled: z.boolean().default(true),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('low'),
      channels: z.object({
        email: z.boolean().default(true),
        push: z.boolean().default(false),
      }).default({ email: true, push: false }),
      sound: z.boolean().default(false),
      vibration: z.boolean().default(false),
      timeWindowEnabled: z.boolean().default(true),
      quietHoursStart: z.string().default('20'),
      quietHoursEnd: z.string().default('9'),
    }).default({
      enabled: true,
      priority: 'low',
      channels: { email: true, push: false },
      sound: false,
      vibration: false,
      timeWindowEnabled: true,
      quietHoursStart: '20',
      quietHoursEnd: '9',
    }),
  }).default({
    'system-updates': {
      enabled: true,
      priority: 'medium',
      channels: { email: true, push: true },
      sound: true,
      vibration: true,
      timeWindowEnabled: false,
      quietHoursStart: '22',
      quietHoursEnd: '7',
    },
    'bar-crawl': {
      enabled: true,
      priority: 'high',
      channels: { email: true, push: true },
      sound: true,
      vibration: true,
      timeWindowEnabled: false,
      quietHoursStart: '22',
      quietHoursEnd: '7',
    },
    'establishment': {
      enabled: true,
      priority: 'low',
      channels: { email: false, push: true },
      sound: false,
      vibration: true,
      timeWindowEnabled: false,
      quietHoursStart: '22',
      quietHoursEnd: '7',
    },
    'promotions': {
      enabled: true,
      priority: 'low',
      channels: { email: true, push: false },
      sound: false,
      vibration: false,
      timeWindowEnabled: true,
      quietHoursStart: '20',
      quietHoursEnd: '9',
    }
  }),
  
  share_activity: z.boolean().default(true),
  allow_mentions: z.boolean().default(true),
  show_online_status: z.boolean().default(true),
});

export interface UserProfileFormData extends z.infer<typeof profileFormSchema> {}

export const useProfileData = () => {
  const [profile, setProfile] = useState<UserProfileFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      display_name: '',
      phone: '',
      email: '',
      bio: '',
      theme_preference: 'system',
      color_mode: 'default',
      accent_color: 'blue',
      email_notifications: true,
      push_notifications: false,
      notification_categories: {
        'system-updates': {
          enabled: true,
          priority: 'medium',
          channels: { email: true, push: true },
          sound: true,
          vibration: true,
          timeWindowEnabled: false,
          quietHoursStart: '22',
          quietHoursEnd: '7',
        },
        'bar-crawl': {
          enabled: true,
          priority: 'high',
          channels: { email: true, push: true },
          sound: true,
          vibration: true,
          timeWindowEnabled: false,
          quietHoursStart: '22',
          quietHoursEnd: '7',
        },
        'establishment': {
          enabled: true,
          priority: 'low',
          channels: { email: false, push: true },
          sound: false,
          vibration: true,
          timeWindowEnabled: false,
          quietHoursStart: '22',
          quietHoursEnd: '7',
        },
        'promotions': {
          enabled: true,
          priority: 'low',
          channels: { email: true, push: false },
          sound: false,
          vibration: false,
          timeWindowEnabled: true,
          quietHoursStart: '20',
          quietHoursEnd: '9',
        }
      },
      share_activity: true,
      allow_mentions: true,
      show_online_status: true,
    },
    mode: "onChange"
  });

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error("Error fetching user profile:", userError);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive",
          });
          return;
        }

        const dummyProfile: UserProfileFormData = {
          first_name: userData?.first_name || '',
          last_name: userData?.last_name || '',
          display_name: userData?.display_name || '',
          phone: userData?.phone || '',
          email: user?.email || '',
          bio: userData?.bio || '',
          
          // Theme preferences
          theme_preference: userData?.theme_preference || 'system',
          color_mode: userData?.color_mode || 'default',
          accent_color: userData?.accent_color || 'blue',
          
          // Notification preferences
          email_notifications: userData?.email_notifications !== undefined ? userData.email_notifications : true,
          push_notifications: userData?.push_notifications !== undefined ? userData.push_notifications : false,
          notification_categories: {
            'system-updates': {
              enabled: true,
              priority: 'medium',
              channels: { email: true, push: true },
              sound: true,
              vibration: true,
              timeWindowEnabled: false,
              quietHoursStart: '22',
              quietHoursEnd: '7',
            },
            'bar-crawl': {
              enabled: true,
              priority: 'high',
              channels: { email: true, push: true },
              sound: true,
              vibration: true,
              timeWindowEnabled: false,
              quietHoursStart: '22',
              quietHoursEnd: '7',
            },
            'establishment': {
              enabled: true,
              priority: 'low',
              channels: { email: false, push: true },
              sound: false,
              vibration: true,
              timeWindowEnabled: false,
              quietHoursStart: '22',
              quietHoursEnd: '7',
            },
            'promotions': {
              enabled: true,
              priority: 'low',
              channels: { email: true, push: false },
              sound: false,
              vibration: false,
              timeWindowEnabled: true,
              quietHoursStart: '20',
              quietHoursEnd: '9',
            }
          },
          
          // Privacy settings
          share_activity: userData?.share_activity !== undefined ? userData.share_activity : true,
          allow_mentions: userData?.allow_mentions !== undefined ? userData.allow_mentions : true,
          show_online_status: userData?.show_online_status !== undefined ? userData.show_online_status : true,
        };

        form.reset(dummyProfile);
        setProfile(dummyProfile);

      } catch (error) {
        console.error("Error loading profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [user]);

  const handleSubmit = useCallback(async (data: UserProfileFormData) => {
    setLoading(true);
    try {
      const updates = {
        ...data,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      if (avatarFile) {
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .upload(`${user?.id}/avatar`, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (storageError) {
          throw storageError;
        }

        const { data: avatarUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user?.id}/avatar`);

        const { error: avatarUrlError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrlData.publicUrl })
          .eq('id', user?.id);

        if (avatarUrlError) {
          throw avatarUrlError;
        }
      }

      setProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, avatarFile, toast]);

  const handlePhotoSelect = (file: File | null) => {
    setAvatarFile(file);
  };

  return {
    form,
    profile,
    loading,
    handleSubmit,
    avatarFile,
    handlePhotoSelect,
  };
};
