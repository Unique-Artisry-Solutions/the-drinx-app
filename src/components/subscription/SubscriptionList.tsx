
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Subscription {
  id: string;
  promoter: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  subscription_start: string;
  follow_status: string;
}

export interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading: boolean;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading your subscriptions...</div>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You aren't following any promoters yet.</p>
        <Button>Find Promoters</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={subscription.promoter.avatar_url} />
                  <AvatarFallback>{subscription.promoter.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{subscription.promoter.display_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Following since {new Date(subscription.subscription_start).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">Unfollow</Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                {subscription.follow_status === 'active' ? 'Active' : subscription.follow_status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionList;
