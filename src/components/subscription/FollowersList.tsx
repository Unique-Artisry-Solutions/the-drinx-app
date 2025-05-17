
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Follower {
  id: string;
  subscriber: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  subscription_start: string;
  follow_status: string;
}

export interface FollowersListProps {
  followers: Follower[];
  isLoading: boolean;
}

const FollowersList: React.FC<FollowersListProps> = ({ followers, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading your followers...</div>;
  }

  if (followers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You don't have any followers yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((follower) => (
        <Card key={follower.id}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={follower.subscriber.avatar_url} />
                  <AvatarFallback>{follower.subscriber.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{follower.subscriber.display_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Following since {new Date(follower.subscription_start).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Profile</Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                {follower.follow_status === 'active' ? 'Active' : follower.follow_status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FollowersList;
