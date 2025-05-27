
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Heart, Crown } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerCountWidgetProps {
  promoterId: string;
}

export const FollowerCountWidget: React.FC<FollowerCountWidgetProps> = ({ promoterId }) => {
  const { subscriptions, isLoading } = useSubscriptions(promoterId);

  const totalFollowers = subscriptions?.length || 0;
  const freeFollowers = subscriptions?.filter(sub => !sub.tier_id).length || 0;
  const premiumFollowers = subscriptions?.filter(sub => sub.tier_id).length || 0;
  const recentGrowth = 12; // Mock growth percentage - would come from analytics

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div className="text-sm font-medium">Loading...</div>
              </div>
              <div className="text-2xl font-bold mt-1">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Followers */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div className="text-sm font-medium">Total Followers</div>
          </div>
          <div className="text-2xl font-bold mt-1">{totalFollowers.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            +{recentGrowth}% this month
          </div>
        </CardContent>
      </Card>

      {/* Free Followers */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-green-500" />
            <div className="text-sm font-medium">Free Followers</div>
          </div>
          <div className="text-2xl font-bold mt-1">{freeFollowers.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">
            {totalFollowers > 0 ? Math.round((freeFollowers / totalFollowers) * 100) : 0}% of total
          </div>
        </CardContent>
      </Card>

      {/* Premium Followers */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-purple-500" />
            <div className="text-sm font-medium">Premium Followers</div>
          </div>
          <div className="text-2xl font-bold mt-1">{premiumFollowers.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">
            {totalFollowers > 0 ? Math.round((premiumFollowers / totalFollowers) * 100) : 0}% of total
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
