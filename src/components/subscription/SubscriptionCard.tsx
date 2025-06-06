
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useToast } from '@/hooks/use-toast';
import { Heart, Crown, Check } from 'lucide-react';
import type { SubscriptionTier } from '@/types/SubscriptionTypes';
import type { FollowerData } from '@/hooks/useFollowers';

interface SubscriptionCardProps {
  promoterId: string;
  tier?: SubscriptionTier;
  isFollowing?: boolean;
  isSubscribed?: boolean;
  currentSubscriptionId?: string;
  isFreeFollower?: boolean;
}

// Type guard to safely check if an object is FollowerData
const isFollowerData = (obj: any): obj is FollowerData => {
  return obj && 
         typeof obj === 'object' && 
         'id' in obj && 
         'promoter_id' in obj;
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  promoterId,
  tier,
  isFollowing = false,
  isSubscribed = false,
  currentSubscriptionId,
  isFreeFollower = false
}) => {
  const { follow, subscribe, unfollow } = useSubscriptions(promoterId);
  const { toast } = useToast();

  const handleAction = async () => {
    try {
      if (isFreeFollower) {
        if (isFollowing) {
          // Unfollow - need a subscription ID
          if (currentSubscriptionId) {
            await unfollow.mutateAsync(currentSubscriptionId);
          }
        } else {
          // Follow for free
          await follow.mutateAsync(promoterId);
        }
      } else if (tier) {
        if (isSubscribed) {
          // Unsubscribe from premium tier
          if (currentSubscriptionId) {
            await unfollow.mutateAsync(currentSubscriptionId);
          }
        } else {
          // Subscribe to premium tier - pass the correct object structure
          await subscribe.mutateAsync({
            promoterId,
            tierId: tier.id
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subscription',
        variant: 'destructive'
      });
    }
  };

  const getButtonText = () => {
    if (isFreeFollower) {
      return isFollowing ? 'Unfollow' : 'Follow for Free';
    }
    return isSubscribed ? 'Unsubscribe' : `Subscribe for $${tier?.price}/month`;
  };

  const getButtonVariant = () => {
    if (isFollowing || isSubscribed) {
      return 'outline';
    }
    return isFreeFollower ? 'default' : 'default';
  };

  // Get benefits safely
  const benefits = tier?.benefits || [];

  return (
    <Card className={`relative ${(isFollowing || isSubscribed) ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isFreeFollower ? (
              <>
                <Heart className="h-5 w-5 text-red-500" />
                Free Follower
              </>
            ) : (
              <>
                <Crown className="h-5 w-5 text-purple-500" />
                {tier?.name || 'Premium'}
              </>
            )}
          </CardTitle>
          {(isFollowing || isSubscribed) && (
            <Badge variant="default" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
        {!isFreeFollower && tier && (
          <div className="text-2xl font-bold">
            ${tier.price}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {isFreeFollower ? (
            <>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Get notified about new events</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Access to public promotions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Basic event updates</span>
              </div>
            </>
          ) : benefits.length > 0 ? (
            benefits.map((benefit: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Premium benefits included</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleAction}
          variant={getButtonVariant()}
          className="w-full"
          disabled={follow.isPending || subscribe.isPending || unfollow.isPending}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
