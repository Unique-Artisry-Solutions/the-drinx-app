
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionList from '@/components/subscription/SubscriptionList';
import SubscriptionDetailCard from './SubscriptionDetailCard';
import { AppSubscription } from '@/types/SubscriptionTypes';

interface SubscriptionManagementProps {
  promoterId: string;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ promoterId }) => {
  const {
    tiers,
    subscriptions,
    isLoading,
    subscribe,
    unsubscribe,
    refetch,
    error
  } = useSubscriptions(promoterId);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center p-8">Loading promoter subscription details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <p className="text-destructive">Failed to load subscription information.</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActiveSubscription = subscriptions.some(sub => sub.status === 'active' || sub.status === 'pending');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your subscriptions to this promoter
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasActiveSubscription ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Your current subscription:</p>
            {subscriptions
              .filter(sub => sub.status === 'active' || sub.status === 'pending')
              .map(subscription => (
                <SubscriptionDetailCard
                  key={subscription.id}
                  subscription={subscription}
                  onCancel={() => unsubscribe.mutate(subscription.id)}
                />
              ))}
          </div>
        ) : (
          // Create an empty list for SubscriptionList component
          <SubscriptionList
            subscriptions={[]}
            isLoading={false}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
