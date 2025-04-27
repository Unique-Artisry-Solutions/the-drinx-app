
import React from 'react';
import { UserRewardDashboard } from '@/components/rewards/UserRewardDashboard';
import { RewardRedemptionFlow } from '@/components/rewards/RewardRedemptionFlow';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';

export default function RewardsPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Rewards</h1>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="redeem">Redeem Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <UserRewardDashboard />
        </TabsContent>
        
        <TabsContent value="redeem">
          <RewardRedemptionFlow />
        </TabsContent>
      </Tabs>
    </div>
  );
}
