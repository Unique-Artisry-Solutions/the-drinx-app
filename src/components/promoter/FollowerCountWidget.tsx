
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart } from 'lucide-react';
import { useFollowers } from '@/hooks/useFollowers';

interface FollowerCountWidgetProps {
  promoterId: string;
}

export const FollowerCountWidget: React.FC<FollowerCountWidgetProps> = ({ promoterId }) => {
  const { followers, analytics, isLoading } = useFollowers(promoterId);

  const totalFollowers = analytics.totalFollowers;
  const activeFollowers = followers.filter(f => f.follow_status === 'active').length;

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
          <div className="mt-4 text-sm">
            <div className="text-muted-foreground">Active: --</div>
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
        <div className="mt-4 flex items-center gap-2">
          <Heart className="h-4 w-4 text-green-500" />
          <div className="text-sm">
            <span className="font-semibold">{activeFollowers}</span>
            <span className="text-muted-foreground"> active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
