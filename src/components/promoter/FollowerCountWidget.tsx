
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Crown, Heart } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerCountWidgetProps {
  promoterId: string;
}

// Type guard to safely access tier_id property
const hasTierId = (follower: any): follower is { tier_id: string | null } => {
  return follower && typeof follower === 'object' && 'tier_id' in follower;
};

export const FollowerCountWidget: React.FC<FollowerCountWidgetProps> = ({ promoterId }) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  console.log('FollowerCountWidget - followers:', followers);
  console.log('FollowerCountWidget - isLoading:', isLoading);

  const totalFollowers = followers?.length || 0;
  const freeFollowers = followers?.filter(follower => 
    !hasTierId(follower) || !follower.tier_id
  ).length || 0;
  const premiumFollowers = followers?.filter(follower => 
    hasTierId(follower) && follower.tier_id
  ).length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Followers</div>
              <div className="text-2xl font-bold">--</div>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Free</div>
              <div className="font-semibold">--</div>
            </div>
            <div>
              <div className="text-muted-foreground">Premium</div>
              <div className="font-semibold">--</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
            <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-muted-foreground">Free</div>
              <div className="font-semibold">{freeFollowers}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-purple-500" />
            <div>
              <div className="text-muted-foreground">Premium</div>
              <div className="font-semibold">{premiumFollowers}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
