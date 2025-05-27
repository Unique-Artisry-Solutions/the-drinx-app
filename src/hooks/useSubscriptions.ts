
import { useFollowers } from './useFollowers';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/SubscriptionTypes';

export function useSubscriptions(promoterId?: string) {
  const followers = useFollowers(promoterId);

  // Get available subscription tiers for a promoter
  const { data: tiers = [], isLoading: tiersLoading } = useQuery({
    queryKey: ['subscription-tiers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      const { data, error } = await supabase
        .from('promoter_subscription_tiers')
        .select('*')
        .eq('promoter_id', promoterId)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      return data as SubscriptionTier[];
    },
    enabled: !!promoterId
  });

  return {
    // Subscription tiers
    tiers,
    
    // User follows/subscriptions - map to the followers data structure
    subscriptions: followers.userFollows,
    
    // Followers for promoter
    followers: followers.promoterFollowers,
    
    // Loading states
    isLoading: followers.isLoading || tiersLoading,
    
    // Actions
    follow: followers.follow,
    subscribe: followers.subscribe,
    unsubscribe: followers.unfollow,
    
    // Promoter communication actions
    sendNotification: followers.sendNotification,
    sendFlyer: followers.sendFlyer,
    sendDiscountCode: followers.sendDiscountCode,
    
    // Preference management
    updatePreferences: followers.updatePreferences,
    
    // Refetch
    refetch: () => {
      followers.refetchUserFollows();
      followers.refetchPromoterFollowers();
    }
  };
}
