
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import type { FollowerData } from '@/hooks/useFollowers';

interface SubscriptionManagementProps {
  promoterId: string;
}

// Type guard to safely check if an object is FollowerData
const isFollowerData = (obj: any): obj is FollowerData => {
  return obj && 
         typeof obj === 'object' && 
         'id' in obj && 
         'subscriber_id' in obj &&
         'follow_status' in obj &&
         'promoter_name' in obj;
};

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ promoterId }) => {
  const { followers, isLoading, unfollow } = useSubscriptions(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading subscriptions...</div>
        </CardContent>
      </Card>
    );
  }

  const handleUnsubscribe = async (followerId: string) => {
    try {
      await unfollow.mutateAsync(followerId);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management ({followers?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {followers?.map((follower: any) => {
            if (!isFollowerData(follower)) return null;

            return (
              <div key={follower.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {follower.promoter_name || `Follower ${follower.subscriber_id.slice(0, 8)}...`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tier: {follower.tier_name || follower.tier_name || 'Free'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {follower.follow_status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsubscribe(follower.id)}
                      disabled={unfollow.isPending}
                    >
                      Unsubscribe
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {(!followers || followers.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              No active subscriptions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
