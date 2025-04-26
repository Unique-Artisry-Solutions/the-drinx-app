
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionTier } from '@/types/SubscriptionTypes';

interface SubscriptionCardProps {
  tier: SubscriptionTier;
  promoterId: string;
  isSubscribed?: boolean;
  currentSubscriptionId?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  tier,
  promoterId,
  isSubscribed = false,
  currentSubscriptionId,
}) => {
  const { user } = useAuth();
  const { subscribe, unsubscribe } = useSubscriptions(promoterId);

  const handleSubscriptionAction = async () => {
    if (isSubscribed && currentSubscriptionId) {
      await unsubscribe.mutateAsync(currentSubscriptionId);
    } else {
      await subscribe.mutateAsync({ promoterId, tierId: tier.id });
    }
  };

  const isLoading = subscribe.isPending || unsubscribe.isPending;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{tier.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-3xl font-bold mb-4">
          ${tier.price.toFixed(2)}
          <span className="text-sm text-gray-500">/month</span>
        </p>
        <ul className="space-y-2 text-left mb-6">
          {Array.isArray(tier.features) && tier.features.map((feature: any, index: number) => (
            <li key={index} className="flex items-center">
              <span className="mr-2">•</span>
              {typeof feature === 'string' ? feature : JSON.stringify(feature)}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleSubscriptionAction}
          disabled={!user || isLoading}
          className={isSubscribed ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}
        >
          {isLoading
            ? 'Processing...'
            : isSubscribed
            ? 'Unsubscribe'
            : `Subscribe ${tier.price > 0 ? `- $${tier.price}/month` : 'Free'}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
