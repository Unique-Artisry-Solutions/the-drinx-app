
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Bell, User, Shield, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AccountTab from './tabs/AccountTab';
import NotificationsTab from './tabs/NotificationsTab';
import AppearanceTab from './tabs/AppearanceTab';
import PrivacyTab from './tabs/PrivacyTab';
import { ProfileFormProvider } from './hooks/useProfileFormContext';
import { NotificationFormProvider } from './hooks/useNotificationFormContext';
import { useProfileData } from './hooks/useProfileData';
import { useNotificationFormData } from './hooks/useNotificationFormData';
import { Form } from '@/components/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';

const SettingsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const isMobile = useIsMobile();
  
  const { 
    form: profileForm,
    profile, 
    loading: profileLoading, 
    handleSubmit: handleProfileSubmit, 
    avatarFile,
    handlePhotoSelect,
  } = useProfileData();

  const {
    form: notificationForm,
    loading: notificationLoading,
    handleSubmit: handleNotificationSubmit
  } = useNotificationFormData();

  const isLightTheme = theme === 'light';
  const isLoading = profileLoading || notificationLoading;

  const handleSubmit = async () => {
    // Submit the appropriate form based on active tab
    if (activeTab === 'notifications') {
      await notificationForm.handleSubmit(handleNotificationSubmit)();
    } else {
      await profileForm.handleSubmit(handleProfileSubmit)();
    }
  };

  return (
    <Layout>
      <div className={cn(
        "container mx-auto py-6 px-4 max-w-4xl",
        isLightTheme ? "text-gray-800" : ""
      )}>
        <div className="flex flex-col items-start mb-6">
          <h1 className={cn(
            "text-2xl font-bold mb-2",
            isLightTheme ? "text-gray-800" : ""
          )}>Settings</h1>
          <p className={cn(
            isLightTheme ? "text-gray-600" : "text-muted-foreground"
          )}>Manage your account settings and preferences</p>
        </div>
        
        <ProfileFormProvider value={profileForm}>
          <NotificationFormProvider value={notificationForm}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "w-full flex justify-start p-1 mb-6",
                isLightTheme ? "bg-gray-100" : ""
              )}>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User size={16} />
                  <span className={isMobile ? "hidden" : ""}>Account</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell size={16} />
                  <span className={isMobile ? "hidden" : ""}>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Moon size={16} />
                  <span className={isMobile ? "hidden" : ""}>Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield size={16} />
                  <span className={isMobile ? "hidden" : ""}>Privacy</span>
                </TabsTrigger>
              </TabsList>
              
              <div>
                {activeTab === 'account' && (
                  <Form {...profileForm}>
                    <AccountTab 
                      profile={profile} 
                      isLightTheme={isLightTheme} 
                      avatarFile={avatarFile}
                      onPhotoSelect={handlePhotoSelect}
                    />
                  </Form>
                )}
                
                {activeTab === 'notifications' && (
                  <Form {...notificationForm}>
                    <NotificationsTab isLightTheme={isLightTheme} />
                  </Form>
                )}
                
                {activeTab === 'appearance' && (
                  <Form {...profileForm}>
                    <AppearanceTab isLightTheme={isLightTheme} />
                  </Form>
                )}
                
                {activeTab === 'privacy' && (
                  <PrivacyTab isLightTheme={isLightTheme} />
                )}
                
                <div className="mt-6 flex justify-between w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className={cn("w-[48%]", isLightTheme ? "border-gray-300 text-gray-700" : "")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 w-[48%]"
                    onClick={handleSubmit}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </Tabs>
          </NotificationFormProvider>
        </ProfileFormProvider>
      </div>
    </Layout>
  );
};

export default SettingsPage;
