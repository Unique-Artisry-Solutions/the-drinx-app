
import { useFollowers } from './useFollowers';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/SubscriptionTypes';

// Mock data for development with proper structure
const MOCK_FOLLOWERS = [
  {
    id: 'mock-follower-1',
    subscriber_id: 'user-123',
    promoter_id: 'mock-promoter-id',
    follow_status: 'active' as const,
    created_at: new Date().toISOString(),
    subscription_start: new Date().toISOString(),
    subscription_end: null,
    tier_id: null,
    updated_at: new Date().toISOString(),
    notification_preferences: {
      events: true,
      promotions: true,
      generalUpdates: true
    },
    tier_name: null,
    promoter_name: 'Sample Promoter'
  },
  {
    id: 'mock-follower-2',
    subscriber_id: 'user-456',
    promoter_id: 'mock-promoter-id',
    follow_status: 'active' as const,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    subscription_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    subscription_end: null,
    tier_id: 'premium-tier',
    updated_at: new Date().toISOString(),
    notification_preferences: {
      events: true,
      promotions: false,
      generalUpdates: true
    },
    tier_name: 'Premium',
    promoter_name: 'Sample Promoter'
  },
  {
    id: 'mock-follower-3',
    subscriber_id: 'user-789',
    promoter_id: 'mock-promoter-id',
    follow_status: 'active' as const,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    subscription_start: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    subscription_end: null,
    tier_id: null,
    updated_at: new Date().toISOString(),
    notification_preferences: {
      events: false,
      promotions: true,
      generalUpdates: true
    },
    tier_name: null,
    promoter_name: 'Sample Promoter'
  }
];

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

  // Provide mock data for development when using mock promoter ID
  const mockFollowers = promoterId === 'mock-promoter-id' ? MOCK_FOLLOWERS : [];
  const actualFollowers = followers.promoterFollowers || [];
  const finalFollowers = actualFollowers.length > 0 ? actualFollowers : mockFollowers;

  console.log('useSubscriptions - promoterId:', promoterId);
  console.log('useSubscriptions - actualFollowers:', actualFollowers);
  console.log('useSubscriptions - mockFollowers:', mockFollowers);
  console.log('useSubscriptions - finalFollowers:', finalFollowers);

  return {
    // Subscription tiers
    tiers,
    
    // User follows/subscriptions - map to the followers data structure
    subscriptions: followers.userFollows,
    
    // Followers for promoter - with mock data fallback
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
