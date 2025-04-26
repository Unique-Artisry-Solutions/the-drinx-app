
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ProfileTab from './tabs/ProfileTab';
import NotificationsTab from './tabs/NotificationsTab';
import AppearanceTab from './tabs/AppearanceTab';
import SubscriptionTab from './tabs/SubscriptionTab';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLightTheme, setIsLightTheme] = useState(false);
  const { user, isLoading } = useAuth();
  
  // Check if user prefers light theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsLightTheme(!isDark);
  }, []);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p>Please sign in to access your settings.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className={cn(
          "text-2xl font-semibold mb-6", 
          isLightTheme ? "text-gray-800" : ""
        )}>
          Settings
        </h1>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <ProfileTab isLightTheme={isLightTheme} />
          <NotificationsTab isLightTheme={isLightTheme} />
          <SubscriptionTab isLightTheme={isLightTheme} />
          <AppearanceTab isLightTheme={isLightTheme} />
        </Tabs>
      </div>
    </Layout>
  );
}
