
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import OverviewTab from '@/components/profile/OverviewTab';
import ActivityTab from '@/components/profile/ActivityTab';
import QuickLinksTab from '@/components/profile/QuickLinksTab';
import BadgesTab from '@/components/profile/BadgesTab';
import UserRecipesTab from '@/components/profile/UserRecipesTab';

interface ProfileTabsProps {
  userName: string;
  userEmail: string;
  userJoinDate: Date | null;
  recentActivity: any[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  userName,
  userEmail,
  userJoinDate,
  recentActivity
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const bgGradientClass = isDarkMode 
    ? "from-gray-800 to-gray-900" 
    : "from-purple-50 to-pink-50";

  return (
    <div className={`bg-gradient-to-r ${bgGradientClass} dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl mb-6 shadow-sm backdrop-blur-sm bg-white/30`}>
      <Tabs defaultValue="overview" className="space-y-3">
        <TabsList className="w-full flex justify-between bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg">
          <TabsTrigger 
            className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
            value="overview"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
            value="activity"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger 
            className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
            value="rewards"
          >
            Rewards
          </TabsTrigger>
          <TabsTrigger 
            className="flex-1 text-[11px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all hover:bg-white/90 dark:hover:bg-gray-700/80"
            value="favorites"
          >
            Favs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-2">
          <OverviewTab 
            userName={userName}
            userEmail={userEmail}
            userJoinDate={userJoinDate}
          />
        </TabsContent>
        
        <TabsContent value="activity" className="pt-2">
          <ActivityTab recentActivity={recentActivity} />
        </TabsContent>
        
        <TabsContent value="rewards" className="pt-2">
          <BadgesTab />
        </TabsContent>
        
        <TabsContent value="favorites" className="pt-2">
          <QuickLinksTab />
        </TabsContent>
        
        <TabsContent value="recipes" className="pt-2">
          <UserRecipesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
