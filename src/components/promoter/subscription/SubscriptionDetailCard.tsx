
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppSubscription } from '@/types/SubscriptionTypes';
import { format } from 'date-fns';

interface SubscriptionDetailCardProps {
  subscription: AppSubscription;
  onCancel: () => void;
}

const SubscriptionDetailCard: React.FC<SubscriptionDetailCardProps> = ({ 
  subscription, 
  onCancel
}) => {
  const startDate = subscription.subscription_start 
    ? format(new Date(subscription.subscription_start), 'PP')
    : 'Unknown';
    
  const endDate = subscription.subscription_end 
    ? format(new Date(subscription.subscription_end), 'PP')
    : 'Active';
  
  const isPending = subscription.status === 'pending';
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              {subscription.subscription_type.charAt(0).toUpperCase() + subscription.subscription_type.slice(1)} Plan
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
              subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Started: {startDate}</p>
            {subscription.subscription_end && (
              <p>Ends: {endDate}</p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Processing...' : 'Cancel Subscription'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionDetailCard;
