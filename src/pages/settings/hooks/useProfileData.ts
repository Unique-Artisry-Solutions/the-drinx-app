
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  display_name: z.string().min(2, { message: "Display name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z.string().max(160, { message: "Bio must be less than 160 characters." }).optional(),
});

export type UserProfileFormData = z.infer<typeof profileFormSchema>;

export const useProfileData = () => {
  const [profile, setProfile] = useState<UserProfileFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      display_name: '',
      username: '',
      phone: '',
      email: '',
      bio: '',
    }
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

        if (userError) throw userError;

        const profileData: UserProfileFormData = {
          display_name: userData.display_name || '',
          username: userData.username || '',
          phone: userData.phone || '',
          email: user.email || '',
          bio: userData.bio || '',
        };

        form.reset(profileData);
        setProfile(profileData);

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
  }, [user, form, toast]);

  const handleSubmit = useCallback(async (data: UserProfileFormData) => {
    setLoading(true);
    try {
      const updates = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      if (avatarFile) {
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .upload(`${user?.id}/avatar`, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (storageError) throw storageError;
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
