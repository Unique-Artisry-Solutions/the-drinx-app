import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { UserRewardDashboard } from '@/components/rewards/UserRewardDashboard';
import { RewardRedemptionFlow } from '@/components/rewards/RewardRedemptionFlow';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Award, Gift, LayoutDashboard } from 'lucide-react';

export default function RewardsPage() {
  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            My Rewards
          </h1>
          <p className="text-muted-foreground">Earn points, unlock achievements, and redeem rewards</p>
        </motion.div>
        
        <Tabs defaultValue="dashboard" className="bg-white dark:bg-gray-900/60 p-4 rounded-lg shadow-sm">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="dashboard" className="flex gap-2 items-center">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="redeem" className="flex gap-2 items-center">
              <Gift className="h-4 w-4" />
              Redeem Rewards
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <UserRewardDashboard />
          </TabsContent>
          
          <TabsContent value="redeem">
            <RewardRedemptionFlow />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
