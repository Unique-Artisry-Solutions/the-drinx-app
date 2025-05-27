
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useRealTimeFollowerNotifications } from '@/hooks/useRealTimeFollowerNotifications';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerNotificationIntegrationProps {
  children: React.ReactNode;
  promoterId?: string;
  enabled?: boolean;
}

const FollowerNotificationIntegration: React.FC<FollowerNotificationIntegrationProps> = ({
  children,
  promoterId,
  enabled = true
}) => {
  const { user } = useAuth();
  const { subscriptions } = useSubscriptions();
  
  // Initialize real-time notifications for all followed promoters
  const followedPromoterIds = subscriptions
    .filter(sub => sub.follow_status === 'active')
    .map(sub => sub.promoter_id);

  // Set up notifications for each followed promoter
  followedPromoterIds.forEach(id => {
    useRealTimeFollowerNotifications({
      promoterId: id,
      enabled: enabled && !!user
    });
  });

  // Set up notifications for specific promoter if provided
  useRealTimeFollowerNotifications({
    promoterId,
    enabled: enabled && !!user && !!promoterId
  });

  return <>{children}</>;
};

export default FollowerNotificationIntegration;
