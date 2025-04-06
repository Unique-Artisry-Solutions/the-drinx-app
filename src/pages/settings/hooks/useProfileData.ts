
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define the validation schema using zod
export const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(50),
  bio: z.string().max(300, 'Bio must be at most 300 characters').optional(),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[0-9\s()-]{0,20}$/, 'Invalid phone number format').optional().or(z.literal('')),
  dark_mode: z.boolean().default(false),
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(false),
  avatar_url: z.string().optional().or(z.literal(''))
});

// Type representing our form data
export type UserProfileFormData = z.infer<typeof profileSchema>;

// Original UserProfile type for backward compatibility
export interface UserProfile {
  username?: string;
  display_name?: string;
  bio?: string;
  email?: string;
  phone?: string;
  dark_mode?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  avatar_url?: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Initialize the form with react-hook-form
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      display_name: '',
      bio: '',
      email: '',
      phone: '',
      dark_mode: theme === 'dark',
      email_notifications: true,
      push_notifications: false,
      avatar_url: '',
    },
    mode: 'onBlur',
  });

  // Extract values and methods from react-hook-form
  const { reset, watch } = form;
  const formValues = watch();
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log('Fetching profile for user:', user.id);
        
        // Check if a profile exists for this user
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle cases where no profile exists
          
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        // Get the email from user authentication
        const userEmail = user.email || '';
        
        if (!data) {
          console.log('No profile found for user, creating default profile');
          
          // Use the auth API to update user metadata first
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              username: user.user_metadata?.username || '',
              name: user.user_metadata?.name || '',
              user_type: user.user_metadata?.user_type || 'individual',
            }
          });
          
          if (updateError) {
            console.error('Error updating user metadata:', updateError);
          }
          
          // Then create the profile record
          const defaultProfile = {
            id: user.id,
            username: user.user_metadata?.username || '',
            display_name: user.user_metadata?.name || '',
            user_type: user.user_metadata?.user_type || 'individual',
            email_notifications: true,
            push_notifications: false,
            bio: '',
            phone: '',
            avatar_url: ''
          };
          
          // Insert the default profile
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert([defaultProfile]); // Use upsert to prevent duplicate key errors
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
          
          // Use react-hook-form reset to update form values
          reset({
            username: defaultProfile.username,
            display_name: defaultProfile.display_name,
            bio: '',
            email: userEmail, // Use the email from authentication
            phone: '',
            dark_mode: theme === 'dark',
            email_notifications: true,
            push_notifications: false,
            avatar_url: '',
          });
        } else {
          console.log('Profile found:', data);
          // Use react-hook-form reset to update form values
          reset({
            username: data.username || '',
            display_name: data.display_name || '',
            bio: data.bio || '',
            email: userEmail, // Use the email from authentication, not from profiles table
            phone: data.phone || '',
            dark_mode: theme === 'dark',
            email_notifications: data.email_notifications !== null ? data.email_notifications : true,
            push_notifications: data.push_notifications !== null ? data.push_notifications : false,
            avatar_url: data.avatar_url || '',
          });
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, theme, reset]);

  // Watch for dark_mode changes and update theme
  useEffect(() => {
    if (formValues.dark_mode !== undefined && formValues.dark_mode !== (theme === 'dark')) {
      toggleTheme();
    }
  }, [formValues.dark_mode, theme, toggleTheme]);

  const handlePhotoSelect = (file: File) => {
    setAvatarFile(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    }
  };

  // Modified to handle form data correctly - removing the event handling
  const handleSubmit = async (formData: UserProfileFormData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Updating profile for user:', user.id);
      
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      // Use upsert instead of update to handle both creation and update
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio,
          phone: formData.phone,
          email_notifications: formData.email_notifications,
          push_notifications: formData.push_notifications,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      if (avatarFile && avatarUrl) {
        form.setValue('avatar_url', avatarUrl);
        setAvatarFile(null);
      }
      
      toast.success('Settings updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update settings: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return {
    profile: formValues,
    loading,
    form,
    handleSubmit,
    avatarFile,
    handlePhotoSelect
  };
};
