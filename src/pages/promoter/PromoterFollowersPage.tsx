
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/auth/AuthProvider';
import FollowerList from '@/components/promoter/followers/FollowerList';
import { FollowerCountWidget } from '@/components/promoter/FollowerCountWidget';
import FollowerAnalyticsWidgets from '@/components/promoter/followers/FollowerAnalyticsWidgets';
import EnhancedFollowerAnalytics from '@/components/promoter/followers/EnhancedFollowerAnalytics';
import JourneyTrackingWidget from '@/components/promoter/followers/JourneyTrackingWidget';
import ChurnAnalytics from '@/components/promoter/followers/ChurnAnalytics';
import FollowerTierManagement from '@/components/promoter/followers/FollowerTierManagement';
import EngagementScoringDashboard from '@/components/promoter/followers/EngagementScoringDashboard';
import WelcomeAutomationDashboard from '@/components/welcomeAutomation/WelcomeAutomationDashboard';
import FollowerManagementDashboard from '@/components/promoter/followers/FollowerManagementDashboard';
import EnhancedEngagementAnalytics from '@/components/promoter/followers/EnhancedEngagementAnalytics';
import PredictiveChurnAnalysis from '@/components/promoter/followers/PredictiveChurnAnalysis';
import FollowerJourneyMapping from '@/components/promoter/followers/FollowerJourneyMapping';
import TierProgressionTracking from '@/components/promoter/followers/TierProgressionTracking';

const PromoterFollowersPage: React.FC = () => {
  const { user } = useAuth();
  const promoterId = user?.id || 'mock-promoter-id';
  const { followers, isLoading, subscriptions } = useSubscriptions(promoterId);

  console.log('PromoterFollowersPage - promoterId:', promoterId);
  console.log('PromoterFollowersPage - followers:', followers);
  console.log('PromoterFollowersPage - subscriptions:', subscriptions);
  console.log('PromoterFollowersPage - isLoading:', isLoading);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Follower Management</h1>
            <p className="text-muted-foreground">
              Comprehensive follower analytics, engagement tracking, and growth optimization
            </p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="churn">Churn Risk</TabsTrigger>
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="progression">Progression</TabsTrigger>
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="list">Followers</TabsTrigger>
            <TabsTrigger value="legacy">Legacy</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <FollowerManagementDashboard promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <EnhancedEngagementAnalytics promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <EngagementScoringDashboard promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="churn" className="space-y-6">
            <PredictiveChurnAnalysis promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            <FollowerJourneyMapping promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <FollowerTierManagement promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="progression" className="space-y-6">
            <TierProgressionTracking promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="welcome" className="space-y-6">
            <WelcomeAutomationDashboard promoterId={promoterId} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <FollowerList 
              promoterId={promoterId}
              showActions={true}
              onError={(error) => console.error('FollowerList error:', error)}
              onSuccess={(data) => console.log('FollowerList success:', data)}
            />
          </TabsContent>

          <TabsContent value="legacy" className="space-y-6">
            {/* Legacy overview components */}
            <FollowerAnalyticsWidgets 
              promoterId={promoterId}
              metrics={['total', 'growth', 'engagement']}
            />

            <FollowerCountWidget promoterId={promoterId} />

            <EnhancedFollowerAnalytics promoterId={promoterId} />

            <JourneyTrackingWidget promoterId={promoterId} />

            <ChurnAnalytics promoterId={promoterId} />

            {/* Recent followers preview */}
            <FollowerList 
              promoterId={promoterId}
              maxItems={5}
              showActions={false}
              onError={(error) => console.error('FollowerList error:', error)}
              onSuccess={(data) => console.log('FollowerList success:', data)}
            />
          </TabsContent>
        </Tabs>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>Promoter ID: {promoterId}</div>
                <div>Loading: {isLoading.toString()}</div>
                <div>Followers count: {followers?.length || 0}</div>
                <div>Subscriptions count: {subscriptions?.length || 0}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PromoterFollowersPage;
