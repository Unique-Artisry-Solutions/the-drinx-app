
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionTier } from '@/types/SubscriptionTypes';
import { featuresByTier, getFeature } from '@/lib/features/registry';
import { CheckIcon, BellIcon, BellOffIcon } from 'lucide-react';

interface SubscriptionCardProps {
  tier?: SubscriptionTier;
  promoterId: string;
  isSubscribed?: boolean;
  currentSubscriptionId?: string;
  promoterName?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  tier,
  promoterId,
  isSubscribed = false,
  currentSubscriptionId,
  promoterName
}) => {
  const { user } = useAuth();
  const { subscribe, unsubscribe } = useSubscriptions(promoterId);

  const handleSubscriptionAction = async () => {
    if (isSubscribed && currentSubscriptionId) {
      await unsubscribe.mutateAsync(currentSubscriptionId);
    } else {
      await subscribe.mutateAsync({ promoterId, tierId: tier?.id });
    }
  };

  const isLoading = subscribe.isPending || unsubscribe.isPending;
  
  // Get the features if tier is available
  const tierFeatures = tier ? featuresByTier[tier.tier || 'basic'] || [] : [];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          {promoterName || (tier ? tier.name : 'Follow this Promoter')}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {tier ? (
          <>
            <ul className="space-y-2 text-left mb-6">
              {/* Display features included in this tier */}
              {tierFeatures.map((featureId) => {
                const feature = getFeature(featureId);
                if (!feature) return null;
                
                return (
                  <li key={feature.id} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature.name}</span>
                  </li>
                );
              })}
              
              {/* Display original features from the tier if any */}
              {Array.isArray(tier.features) && tier.features.map((feature: any, index: number) => {
                // Skip if this is a string that might be a duplicate with our feature registry
                if (typeof feature === 'string' && tierFeatures.length > 0) return null;
                
                return (
                  <li key={index} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Follow this promoter to receive updates about events, exclusive discount codes, and promotional materials.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleSubscriptionAction}
          disabled={!user || isLoading}
          className={isSubscribed ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}
          variant={isSubscribed ? "destructive" : "default"}
        >
          {isLoading
            ? 'Processing...'
            : isSubscribed
            ? (
              <>
                <BellOffIcon className="h-4 w-4 mr-2" />
                Unfollow
              </>
            ) : (
              <>
                <BellIcon className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
