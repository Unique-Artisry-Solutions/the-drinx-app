
import React from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionCard from './SubscriptionCard';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionListProps {
  promoterId: string;
  promoterName?: string;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ promoterId, promoterName }) => {
  const { tiers, subscriptions, isLoading } = useSubscriptions(promoterId);
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading promoter details...</div>;
  }

  const currentSubscription = subscriptions.find(
    (sub) => sub.promoter_id === promoterId
  );

  const isSubscribed = !!currentSubscription;

  // If there are no tiers, just show a simple follow card
  if (!tiers.length) {
    return (
      <div className="flex justify-center p-4">
        <SubscriptionCard
          promoterId={promoterId}
          promoterName={promoterName}
          isSubscribed={isSubscribed}
          currentSubscriptionId={currentSubscription?.id}
        />
      </div>
    );
  }

  // If there are tiers, show tier-based subscription options
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {tiers.map((tier) => {
        const tierSubscription = subscriptions.find(
          (sub) => sub.tier_id === tier.id && sub.promoter_id === promoterId
        );
        
        return (
          <SubscriptionCard
            key={tier.id}
            tier={tier}
            promoterId={promoterId}
            promoterName={promoterName}
            isSubscribed={!!tierSubscription}
            currentSubscriptionId={tierSubscription?.id}
          />
        );
      })}
    </div>
  );
};

export default SubscriptionList;
