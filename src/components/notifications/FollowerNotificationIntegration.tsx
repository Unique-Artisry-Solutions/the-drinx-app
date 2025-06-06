
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useRealTimeFollowerNotifications } from '@/hooks/useRealTimeFollowerNotifications';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import type { FollowerData } from '@/hooks/useFollowers';

interface FollowerNotificationIntegrationProps {
  children: React.ReactNode;
  promoterId?: string;
  enabled?: boolean;
}

// Type guard to safely check if an object is FollowerData
const isFollowerData = (obj: any): obj is FollowerData => {
  return obj && 
         typeof obj === 'object' && 
         'follow_status' in obj && 
         'promoter_id' in obj;
};

const FollowerNotificationIntegration: React.FC<FollowerNotificationIntegrationProps> = ({
  children,
  promoterId,
  enabled = true
}) => {
  const { user } = useAuth();
  const { subscriptions } = useSubscriptions();
  
  // Initialize real-time notifications for all followed promoters
  const followedPromoterIds = subscriptions
    .filter((sub: any) => isFollowerData(sub) && sub.follow_status === 'active')
    .map((sub: any) => isFollowerData(sub) ? sub.promoter_id : null)
    .filter(Boolean);

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
