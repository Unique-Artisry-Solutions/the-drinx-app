
import React from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionListProps {
  promoterId: string;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ promoterId }) => {
  const { tiers, subscriptions, isLoading } = useSubscriptions(promoterId);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading subscription options...</div>;
  }

  if (!tiers.length) {
    return (
      <div className="text-center p-8">
        <p>No subscription tiers available for this promoter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {tiers.map((tier) => {
        const currentSubscription = subscriptions.find(
          (sub) => sub.tier_id === tier.id && sub.promoter_id === promoterId
        );
        
        return (
          <SubscriptionCard
            key={tier.id}
            tier={tier}
            promoterId={promoterId}
            isSubscribed={!!currentSubscription}
            currentSubscriptionId={currentSubscription?.id}
          />
        );
      })}
    </div>
  );
};

export default SubscriptionList;
