
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFollowers, FollowerData } from '@/hooks/useFollowers';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, Star } from 'lucide-react';

interface SubscriptionManagementProps {
  promoterId: string;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ promoterId }) => {
  const { followers, analytics, isLoading } = useFollowers(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div>Loading subscription data...</div>
        </CardContent>
      </Card>
    );
  }

  const tierStats = followers.reduce((acc, follower: FollowerData) => {
    const tier = follower.tier_name || 'Free';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Subscription Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics?.totalFollowers || 0}</div>
              <div className="text-sm text-muted-foreground">Total Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics?.newThisWeek || 0}</div>
              <div className="text-sm text-muted-foreground">New This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics?.growthRate || 0}%</div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Tier Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(tierStats).map(([tier, count]) => (
              <div key={tier} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>{tier}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
