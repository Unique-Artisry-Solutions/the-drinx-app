
import { useFollowers, type FollowerData } from './useFollowers';
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
      
      // If using mock promoter ID, return mock data
      if (promoterId === 'mock-promoter-id') {
        return [];
      }
      
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

  // Use the followers data directly
  const finalFollowers = followers.promoterFollowers;

  console.log('useSubscriptions - promoterId:', promoterId);
  console.log('useSubscriptions - finalFollowers:', finalFollowers);

  return {
    // Subscription tiers
    tiers,
    
    // User follows/subscriptions - map to the followers data structure
    subscriptions: followers.userFollows,
    
    // Followers for promoter
    followers: finalFollowers,
    
    // Loading states
    isLoading: followers.isLoading || tiersLoading,
    
    // Actions - pass through the mutations
    follow: followers.follow,
    subscribe: followers.subscribe,
    unfollow: followers.unfollow,
    unsubscribe: followers.unfollow, // Alias for consistency
    
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
