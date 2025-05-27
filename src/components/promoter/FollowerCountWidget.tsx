
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerCountWidgetProps {
  promoterId: string;
}

export const FollowerCountWidget: React.FC<FollowerCountWidgetProps> = ({ promoterId }) => {
  const { subscriptions, isLoading } = useSubscriptions(promoterId);

  const followerCount = subscriptions?.length || 0;
  const recentGrowth = 12; // Mock growth percentage - would come from analytics

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div className="text-sm font-medium">Followers</div>
          </div>
          <div className="text-2xl font-bold mt-1">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <div className="text-sm font-medium">Followers</div>
        </div>
        <div className="text-2xl font-bold mt-1">{followerCount.toLocaleString()}</div>
        <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          +{recentGrowth}% this month
        </div>
      </CardContent>
    </Card>
  );
};
