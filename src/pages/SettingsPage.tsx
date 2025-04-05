import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import BackButton from '@/components/navigation/BackButton';
import { Settings, Bell, User, Shield, Moon, Upload } from 'lucide-react';
import PhotoUploadField from '@/components/PhotoUploadField';
import { cn } from '@/lib/utils';

interface UserProfile {
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

interface DBProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  user_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  bio?: string | null;
  phone?: string | null;
  email_notifications?: boolean | null;
  push_notifications?: boolean | null;
  avatar_url?: string | null;
}

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (data) {
          const profileData = data as DBProfile;
          setProfile({
            username: profileData.username || '',
            display_name: profileData.display_name || '',
            bio: profileData.bio || '',
            email: user.email || '',
            phone: profileData.phone || '',
            dark_mode: theme === 'dark',
            email_notifications: profileData.email_notifications || true,
            push_notifications: profileData.push_notifications || false,
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

  const handlePhotoSelect = async (file: File) => {
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

  const isLightTheme = theme === 'light';

  return (
    <Layout>
      <div className={cn(
        "container mx-auto py-6 px-4 max-w-4xl",
        isLightTheme ? "text-gray-800" : ""
      )}>
        <BackButton fallbackPath="/profile" />
        
        <div className="flex flex-col items-start mb-6">
          <h1 className={cn(
            "text-2xl font-bold mb-2",
            isLightTheme ? "text-gray-800" : ""
          )}>Settings</h1>
          <p className={cn(
            isLightTheme ? "text-gray-600" : "text-muted-foreground"
          )}>Manage your account settings and preferences</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn(
            "w-full flex justify-start p-1 mb-6",
            isLightTheme ? "bg-gray-100" : ""
          )}>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User size={16} />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Moon size={16} />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield size={16} />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="account">
              <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
                <CardHeader>
                  <CardTitle className={isLightTheme ? "text-gray-800" : ""}>Account Information</CardTitle>
                  <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className={isLightTheme ? "text-gray-700" : ""}>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      {profile.avatar_url && (
                        <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                          <img 
                            src={profile.avatar_url} 
                            alt="Avatar" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <PhotoUploadField onPhotoSelect={handlePhotoSelect} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="display_name" className={isLightTheme ? "text-gray-700" : ""}>Display Name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={profile.display_name}
                      onChange={handleChange}
                      placeholder="Your display name"
                      className={isLightTheme ? "bg-white border-gray-200" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className={isLightTheme ? "text-gray-700" : ""}>Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      placeholder="Your username"
                      className={isLightTheme ? "bg-white border-gray-200" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio" className={isLightTheme ? "text-gray-700" : ""}>Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      className={cn(
                        "h-24",
                        isLightTheme ? "bg-white border-gray-200" : ""
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className={isLightTheme ? "text-gray-700" : ""}>Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profile.email}
                      disabled
                      className={cn(
                        isLightTheme ? "bg-gray-100 text-gray-500 border-gray-200" : "text-muted-foreground"
                      )}
                    />
                    <p className={cn(
                      "text-xs", 
                      isLightTheme ? "text-gray-500" : "text-muted-foreground"
                    )}>Email cannot be changed here</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={isLightTheme ? "text-gray-700" : ""}>Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className={isLightTheme ? "bg-white border-gray-200" : ""}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
                <CardHeader>
                  <CardTitle className={isLightTheme ? "text-gray-800" : ""}>Notification Preferences</CardTitle>
                  <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={isLightTheme ? "text-gray-700" : ""}>Email Notifications</Label>
                      <p className={cn(
                        "text-sm", 
                        isLightTheme ? "text-gray-600" : "text-muted-foreground"
                      )}>Receive updates via email</p>
                    </div>
                    <Switch
                      checked={profile.email_notifications}
                      onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={isLightTheme ? "text-gray-700" : ""}>Push Notifications</Label>
                      <p className={cn(
                        "text-sm", 
                        isLightTheme ? "text-gray-600" : "text-muted-foreground"
                      )}>Receive updates on your device</p>
                    </div>
                    <Switch
                      checked={profile.push_notifications}
                      onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
                <CardHeader>
                  <CardTitle className={isLightTheme ? "text-gray-800" : ""}>Appearance Settings</CardTitle>
                  <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
                    Customize how the app looks
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={isLightTheme ? "text-gray-700" : ""}>Dark Mode</Label>
                      <p className={cn(
                        "text-sm", 
                        isLightTheme ? "text-gray-600" : "text-muted-foreground"
                      )}>Use dark theme throughout the app</p>
                    </div>
                    <Switch
                      checked={profile.dark_mode}
                      onCheckedChange={(checked) => handleToggle('dark_mode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
                <CardHeader>
                  <CardTitle className={isLightTheme ? "text-gray-800" : ""}>Privacy Settings</CardTitle>
                  <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
                    Manage your privacy preferences
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className={cn(
                    isLightTheme ? "text-gray-600" : "text-muted-foreground"
                  )}>Privacy settings will be available in a future update.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="mt-6 flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                className={isLightTheme ? "border-gray-300 text-gray-700" : ""}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
