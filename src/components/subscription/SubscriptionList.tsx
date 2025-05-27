
import React from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionListProps {
  promoterId: string;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ promoterId }) => {
  const { tiers, subscriptions, isLoading } = useSubscriptions(promoterId);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading follow options...</div>;
  }

  // Check if user is already following/subscribed
  const currentSubscription = subscriptions.find(
    (sub) => sub.promoter_id === promoterId
  );

  const isFollowing = !!currentSubscription && !currentSubscription.tier_id;
  const isSubscribed = !!currentSubscription && !!currentSubscription.tier_id;

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Follow This Promoter</h2>
        <p className="text-gray-600">
          Start with free following or upgrade to premium for exclusive benefits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Free Follower Option - Always show first */}
        <SubscriptionCard
          promoterId={promoterId}
          isFollowing={isFollowing}
          currentSubscriptionId={currentSubscription?.id}
          isFreeFollower={true}
        />

        {/* Premium Tiers */}
        {tiers.map((tier) => {
          const isCurrentTier = currentSubscription?.tier_id === tier.id;
          
          return (
            <SubscriptionCard
              key={tier.id}
              tier={tier}
              promoterId={promoterId}
              isSubscribed={isCurrentTier}
              currentSubscriptionId={currentSubscription?.id}
            />
          );
        })}
      </div>

      {tiers.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            This promoter hasn't set up premium follow tiers yet, but you can still follow for free!
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;
