
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowerData } from '@/hooks/useFollowers';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionListProps {
  subscriptions: FollowerData[];
  isLoading?: boolean;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ 
  subscriptions, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div>Loading subscriptions...</div>
        </CardContent>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No active subscriptions found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Subscriptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onUpgrade={() => console.log('Upgrade subscription')}
            onCancel={() => console.log('Cancel subscription')}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionList;
