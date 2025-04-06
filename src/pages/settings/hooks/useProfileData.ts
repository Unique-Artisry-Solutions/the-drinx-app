
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    display_name: '',
    bio: '',
    email: '',
    phone: '',
    dark_mode: theme === 'dark',
    email_notifications: true,
    push_notifications: false,
    avatar_url: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log('Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
          
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log('No profile found for user, creating default profile');
          
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
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([defaultProfile]);
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
          
          setProfile({
            username: defaultProfile.username,
            display_name: defaultProfile.display_name,
            bio: '',
            email: user.email || '',
            phone: '',
            dark_mode: theme === 'dark',
            email_notifications: true,
            push_notifications: false,
            avatar_url: '',
          });
        } else {
          console.log('Profile found:', data[0]);
          const profileData = data[0];
          setProfile({
            username: profileData.username || '',
            display_name: profileData.display_name || '',
            bio: profileData.bio || '',
            email: user.email || '',
            phone: profileData.phone || '',
            dark_mode: theme === 'dark',
            email_notifications: profileData.email_notifications !== null ? profileData.email_notifications : true,
            push_notifications: profileData.push_notifications !== null ? profileData.push_notifications : false,
            avatar_url: profileData.avatar_url || '',
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
  }, [user, theme]);

  useEffect(() => {
    if (profile.dark_mode !== undefined && profile.dark_mode !== (theme === 'dark')) {
      toggleTheme();
    }
  }, [profile.dark_mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string, checked: boolean) => {
    if (name === 'dark_mode') {
      toggleTheme();
    }
    setProfile(prev => ({ ...prev, [name]: checked }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Updating profile for user:', user.id);
      
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          phone: profile.phone,
          email_notifications: profile.email_notifications,
          push_notifications: profile.push_notifications,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      if (avatarFile && avatarUrl) {
        setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
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
    profile,
    loading,
    setProfile,
    handleChange,
    handleToggle,
    handleSubmit,
    avatarFile,
    handlePhotoSelect
  };
};
