
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionTier } from '@/types/SubscriptionTypes';
import { featuresByTier, getFeature } from '@/lib/features/registry';
import { CheckIcon, Heart, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SubscriptionCardProps {
  tier?: SubscriptionTier;
  promoterId: string;
  isFollowing?: boolean;
  isSubscribed?: boolean;
  currentSubscriptionId?: string;
  isFreeFollower?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  tier,
  promoterId,
  isFollowing = false,
  isSubscribed = false,
  currentSubscriptionId,
  isFreeFollower = false,
}) => {
  const { user } = useAuth();
  const { follow, subscribe, unsubscribe } = useSubscriptions(promoterId);

  const handleAction = async () => {
    if (isFollowing || isSubscribed) {
      if (currentSubscriptionId) {
        await unsubscribe.mutateAsync(currentSubscriptionId);
      }
    } else {
      if (tier) {
        // Subscribe to premium tier
        await subscribe.mutateAsync({ promoterId, tierId: tier.id });
      } else {
        // Free follow - pass just the promoterId string
        await follow.mutateAsync(promoterId);
      }
    }
  };

  const isLoading = follow.isPending || subscribe.isPending || unsubscribe.isPending;

  // Free follower card
  if (!tier) {
    return (
      <Card className="w-full max-w-sm border-2 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-500" />
              Free Follow
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Free
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="text-2xl font-bold text-green-600 mb-2">Free to Follow</div>
            <p className="text-sm text-gray-600">Stay connected with this promoter</p>
          </div>
          <ul className="space-y-2 text-left mb-6">
            <li className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Get notified of new events</span>
            </li>
            <li className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Follow promoter updates</span>
            </li>
            <li className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Basic event information</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleAction}
            disabled={!user || isLoading}
            className={isFollowing 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'}
          >
            {isLoading
              ? 'Processing...'
              : isFollowing
              ? 'Unfollow'
              : 'Follow for Free'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Premium tier card
  const tierFeatures = featuresByTier[tier.tier || 'basic'] || [];

  return (
    <Card className={`w-full max-w-sm ${tier.tier === 'vip' ? 'border-2 border-purple-300' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            {tier.tier === 'vip' && <Crown className="h-5 w-5 text-purple-500" />}
            {tier.name}
          </CardTitle>
          <Badge variant={tier.tier === 'vip' ? 'default' : 'secondary'}>
            {tier.tier?.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-6">
          <div className="text-2xl font-bold mb-2">Premium Follow</div>
          <p className="text-sm text-gray-600">Enhanced experience with exclusive benefits</p>
        </div>
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

          {/* Always include free features */}
          <li className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
            <span>All free follower benefits</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleAction}
          disabled={!user || isLoading}
          className={isSubscribed ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}
        >
          {isLoading
            ? 'Processing...'
            : isSubscribed
            ? 'Unfollow'
            : 'Follow Premium'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
