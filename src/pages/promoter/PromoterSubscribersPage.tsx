
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth/AuthProvider';
import SubscriberManagementDashboard from '@/components/promoter/subscribers/SubscriberManagementDashboard';
import EnhancedEngagementAnalytics from '@/components/promoter/subscribers/EnhancedEngagementAnalytics';
import PredictiveChurnAnalysis from '@/components/promoter/subscribers/PredictiveChurnAnalysis';
import SubscriberJourneyMapping from '@/components/promoter/subscribers/SubscriberJourneyMapping';
import TierProgressionTracking from '@/components/promoter/subscribers/TierProgressionTracking';
import EnhancedCommunicationHub from '@/components/promoter/subscribers/EnhancedCommunicationHub';
import { Users, BarChart3, MessageSquare, Target, Map, Trophy } from 'lucide-react';

const PromoterSubscribersPage: React.FC = () => {
  const { user } = useAuth();
  const promoterId = user?.id || 'mock-promoter-id';
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Subscriber Management</h1>
          <p className="text-muted-foreground">
            Comprehensive subscriber analytics, engagement tracking, monetization, and communication tools
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="churn" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Churn Risk
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Journey
            </TabsTrigger>
            <TabsTrigger value="tiers" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Tiers
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SubscriberManagementDashboard promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <EnhancedEngagementAnalytics promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="churn" className="space-y-6">
            <PredictiveChurnAnalysis promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            <SubscriberJourneyMapping promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <TierProgressionTracking promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <EnhancedCommunicationHub promoterId={promoterId} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterSubscribersPage;
