
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
import { useProfileData } from './hooks/useProfileData';
import { Form } from '@/components/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';

const SettingsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const isMobile = useIsMobile();
  
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
              
              {/* Use onSubmit with the form's handleSubmit wrapper around our submit function */}
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                {activeTab === 'account' && (
                  <AccountTab 
                    profile={profile} 
                    isLightTheme={isLightTheme} 
                    avatarFile={avatarFile}
                    onPhotoSelect={handlePhotoSelect}
                  />
                )}
                
                {activeTab === 'notifications' && (
                  <NotificationsTab 
                    profile={profile} 
                    isLightTheme={isLightTheme} 
                  />
                )}
                
                {activeTab === 'appearance' && (
                  <AppearanceTab 
                    profile={profile} 
                    isLightTheme={isLightTheme} 
                  />
                )}
                
                {activeTab === 'privacy' && (
                  <PrivacyTab 
                    isLightTheme={isLightTheme} 
                  />
                )}
                
                <div className="mt-6 flex justify-between w-full gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className={cn("flex-1", isLightTheme ? "border-gray-300 text-gray-700" : "")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 flex-1"
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
