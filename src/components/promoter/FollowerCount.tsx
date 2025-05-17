
import React from 'react';
import { useFollowers } from '@/hooks/useFollowers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FollowerCountProps {
  promoterId: string;
}

const FollowerCount: React.FC<FollowerCountProps> = ({ promoterId }) => {
  const { followers, isLoading } = useFollowers(promoterId);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const followerCount = followers.length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Followers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{followerCount}</p>
            <p className="text-xs text-muted-foreground">
              {followerCount === 0 ? 'No followers yet' : followerCount === 1 ? 'Person following you' : 'People following you'}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerCount;
