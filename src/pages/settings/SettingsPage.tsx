
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import BackButton from '@/components/navigation/BackButton';
import { Bell, User, Shield, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AccountTab from './tabs/AccountTab';
import NotificationsTab from './tabs/NotificationsTab';
import AppearanceTab from './tabs/AppearanceTab';
import PrivacyTab from './tabs/PrivacyTab';
import { useProfileData } from './hooks/useProfileData';
import { ProfileFormProvider } from './hooks/useProfileFormContext';
import { Form } from '@/components/ui/form';

const SettingsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  const { 
    form,
    profile, 
    loading, 
    handleSubmit, 
    avatarFile,
    handlePhotoSelect,
  } = useProfileData();

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
        
        <ProfileFormProvider value={form}>
          <Form {...form}>
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
              
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <AccountTab 
                  profile={profile} 
                  isLightTheme={isLightTheme} 
                  avatarFile={avatarFile}
                  onPhotoSelect={handlePhotoSelect}
                />
                
                <NotificationsTab 
                  profile={profile} 
                  isLightTheme={isLightTheme} 
                />
                
                <AppearanceTab 
                  profile={profile} 
                  isLightTheme={isLightTheme} 
                />
                
                <PrivacyTab 
                  isLightTheme={isLightTheme} 
                />
                
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
          </Form>
        </ProfileFormProvider>
      </div>
    </Layout>
  );
};

export default SettingsPage;
