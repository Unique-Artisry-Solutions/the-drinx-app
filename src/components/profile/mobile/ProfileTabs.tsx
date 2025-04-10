
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import OverviewTabContent from './tabs/OverviewTabContent';
import ActivityTabContent from './tabs/ActivityTabContent';
import PromotionsTabContent from './tabs/PromotionsTabContent';
import RecipesTabContent from './tabs/RecipesTabContent';

interface ProfileTabsProps {
  userName: string;
  userEmail: string;
  userJoinDate: Date | null;
  recentActivity: any[];
  isPromoter?: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  userName,
  userEmail,
  userJoinDate,
  recentActivity,
  isPromoter = false
}) => {
  const tabContainerClass = isPromoter 
    ? "grid grid-cols-4 gap-px bg-purple-100 rounded-xl p-0.5" 
    : "grid grid-cols-4 gap-px bg-gray-100 rounded-xl p-0.5";
    
  const tabTriggerClass = (isActive: boolean) => 
    cn(
      "text-xs py-2 rounded-lg transition-all",
      isActive 
        ? isPromoter
          ? "bg-white text-purple-700 shadow-sm font-medium"
          : "bg-white text-spiritless-pink shadow-sm font-medium" 
        : "bg-transparent text-gray-600 hover:text-gray-800"
    );
  
  return (
    <Tabs defaultValue="overview" className="px-4">
      <TabsList className={tabContainerClass}>
        <TabsTrigger 
          value="overview"
          className={(value) => tabTriggerClass(value === 'overview')}
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="activity"
          className={(value) => tabTriggerClass(value === 'activity')}
        >
          Activity
        </TabsTrigger>
        <TabsTrigger 
          value={isPromoter ? "promotions" : "badges"}
          className={(value) => tabTriggerClass(value === (isPromoter ? "promotions" : "badges"))}
        >
          {isPromoter ? "Promos" : "Badges"}
        </TabsTrigger>
        <TabsTrigger 
          value="recipes"
          className={(value) => tabTriggerClass(value === 'recipes')}
        >
          Recipes
        </TabsTrigger>
      </TabsList>
      
      <div className="pt-4 animate-fade-in">
        <TabsContent value="overview">
          <OverviewTabContent 
            userName={userName} 
            userEmail={userEmail} 
            userJoinDate={userJoinDate} 
            isPromoter={isPromoter}
          />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityTabContent recentActivity={recentActivity} isPromoter={isPromoter} />
        </TabsContent>
        
        {isPromoter ? (
          <TabsContent value="promotions">
            <PromotionsTabContent />
          </TabsContent>
        ) : (
          <TabsContent value="badges">
            <div className="card bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">Your Badges</h3>
              <p className="text-gray-500">You haven't earned any badges yet.</p>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="recipes">
          <RecipesTabContent isPromoter={isPromoter} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfileTabs;
