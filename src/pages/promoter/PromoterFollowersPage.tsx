
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/auth/AuthProvider';
import FollowerList from '@/components/promoter/followers/FollowerList';
import { FollowerCountWidget } from '@/components/promoter/FollowerCountWidget';
import FollowerAnalyticsWidgets from '@/components/promoter/followers/FollowerAnalyticsWidgets';

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
          <h1 className="text-3xl font-bold">Followers</h1>
        </div>

        {/* Analytics widgets */}
        <FollowerAnalyticsWidgets 
          promoterId={promoterId}
          metrics={['total', 'growth', 'engagement']}
        />

        {/* Follower count widget */}
        <FollowerCountWidget promoterId={promoterId} />

        {/* Main followers list */}
        <FollowerList 
          promoterId={promoterId}
          showActions={true}
          onError={(error) => console.error('FollowerList error:', error)}
          onSuccess={(data) => console.log('FollowerList success:', data)}
        />

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
