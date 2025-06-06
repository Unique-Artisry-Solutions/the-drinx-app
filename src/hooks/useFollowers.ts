import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

// Define the correct follower type based on the actual database schema
export interface FollowerData {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  tier_id?: string;
  tier_name?: string;
  promoter_name?: string;
  follow_status: 'active' | 'paused' | 'cancelled' | 'pending';
  subscription_start?: string;
  created_at: string;
  notification_preferences?: {
    events?: boolean;
    promotions?: boolean;
    announcements?: boolean;
  };
  // New Phase 1 fields
  discovery_source?: string;
  referral_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
  last_engagement_at?: string;
  engagement_count: number;
  total_interactions: number;
  churn_risk_score: number;
  follower_tier: string;
  discovery_metadata?: Record<string, any>;
}

export interface FollowRequest {
  promoterId: string;
  discoverySource?: string;
  referralSource?: string;
  utmParams?: {
    campaign?: string;
    medium?: string;
    source?: string;
  };
  metadata?: Record<string, any>;
}

export function useFollowers(promoterId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Define query key constants
  const USER_FOLLOWS_KEY = ['user-follows'];
  const PROMOTER_FOLLOWERS_KEY = ['promoter-followers'];

  // Get user's follows/subscriptions
  const { data: userFollows = [], isLoading: userFollowsLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: [USER_FOLLOWS_KEY],
    queryFn: async () => {
      // Mock data for now - replace with actual query when database is ready
      const mockUserFollows: FollowerData[] = [
        {
          id: 'follow-1',
          subscriber_id: 'mock-user-id',
          promoter_id: 'mock-promoter-id',
          tier_id: null,
          tier_name: 'Basic',
          promoter_name: 'Sample Promoter',
          follow_status: 'active' as const,
          subscription_start: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notification_preferences: { events: true, promotions: true },
          discovery_source: 'Social Media',
          referral_source: 'Referral',
          utm_campaign: 'SummerSale',
          utm_medium: 'CPC',
          utm_source: 'Google',
          last_engagement_at: new Date().toISOString(),
          engagement_count: 10,
          total_interactions: 50,
          churn_risk_score: 0.5,
          follower_tier: 'new',
          discovery_metadata: { source: 'Facebook', type: 'Post' }
        }
      ];
      return mockUserFollows;
    },
    enabled: true
  });

  // Get followers for a promoter
  const { data: promoterFollowers = [], isLoading: promoterFollowersLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: [PROMOTER_FOLLOWERS_KEY, promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      // Mock data for now - replace with actual query when database is ready
      const mockFollowers: FollowerData[] = [
        {
          id: 'follower-1',
          subscriber_id: 'user-1',
          promoter_id: promoterId,
          tier_id: null,
          tier_name: 'Basic',
          promoter_name: 'User One',
          follow_status: 'active' as const,
          subscription_start: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notification_preferences: { events: true, promotions: true },
          discovery_source: 'Social Media',
          referral_source: 'Referral',
          utm_campaign: 'SummerSale',
          utm_medium: 'CPC',
          utm_source: 'Google',
          last_engagement_at: new Date().toISOString(),
          engagement_count: 10,
          total_interactions: 50,
          churn_risk_score: 0.5,
          follower_tier: 'new',
          discovery_metadata: { source: 'Facebook', type: 'Post' }
        },
        {
          id: 'follower-2',
          subscriber_id: 'user-2',
          promoter_id: promoterId,
          tier_id: 'tier-1',
          tier_name: 'Premium',
          promoter_name: 'User Two',
          follow_status: 'active' as const,
          subscription_start: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notification_preferences: { events: true, promotions: false },
          discovery_source: 'Social Media',
          referral_source: 'Referral',
          utm_campaign: 'SummerSale',
          utm_medium: 'CPC',
          utm_source: 'Google',
          last_engagement_at: new Date().toISOString(),
          engagement_count: 10,
          total_interactions: 50,
          churn_risk_score: 0.5,
          follower_tier: 'new',
          discovery_metadata: { source: 'Facebook', type: 'Post' }
        }
      ];
      return mockFollowers;
    },
    enabled: !!promoterId
  });

  // Enhanced follow mutation with journey tracking
  const follow = useMutation({
    mutationFn: async (request: FollowRequest | string) => {
      if (!user) throw new Error('Authentication required');

      const followData = typeof request === 'string' ? { promoterId: request } : request;
      
      const insertData = {
        subscriber_id: user.id,
        promoter_id: followData.promoterId,
        follow_status: 'active' as const,
        discovery_source: followData.discoverySource,
        referral_source: followData.referralSource,
        utm_campaign: followData.utmParams?.campaign,
        utm_medium: followData.utmParams?.medium,
        utm_source: followData.utmParams?.source,
        discovery_metadata: followData.metadata || {},
        engagement_count: 0,
        total_interactions: 0,
        churn_risk_score: 0,
        follower_tier: 'new'
      };

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Successfully followed!',
        description: 'You are now following this promoter.',
      });
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    },
    onError: (error) => {
      console.error('Follow error:', error);
      toast({
        title: 'Error',
        description: 'Failed to follow promoter',
        variant: 'destructive'
      });
    }
  });

  // Mutation for subscribing to a promoter
  const subscribeMutation = useMutation({
    mutationFn: async (data: { promoterId: string; tierId?: string }) => {
      console.log('Subscribe action:', data);
      // Implementation would go here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
    }
  });

  // Mutation for unfollowing a promoter
  const unfollowMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      console.log('Unfollow action for subscription:', subscriptionId);
      // Implementation would go here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  // Mutation for sending notifications
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: { message: string; followers: string[] }) => {
      console.log('Send notification:', data);
      // Implementation would go here
      return { success: true };
    }
  });

  // Mutation for sending flyers
  const sendFlyerMutation = useMutation({
    mutationFn: async (data: { flyerId: string; followers: string[] }) => {
      console.log('Send flyer:', data);
      // Implementation would go here
      return { success: true };
    }
  });

  // Mutation for sending discount codes
  const sendDiscountCodeMutation = useMutation({
    mutationFn: async (data: { code: string; followers: string[] }) => {
      console.log('Send discount code:', data);
      // Implementation would go here
      return { success: true };
    }
  });

  // Mutation for updating preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: { subscriptionId: string; preferences: any }) => {
      console.log('Update preferences:', data);
      // Implementation would go here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
    }
  });

  return {
    promoterFollowers,
    userFollows,
    isLoading: userFollowsLoading || promoterFollowersLoading,
    
    // Mutations
    follow,
    subscribe: subscribeMutation,
    unfollow: unfollowMutation,
    sendNotification: sendNotificationMutation,
    sendFlyer: sendFlyerMutation,
    sendDiscountCode: sendDiscountCodeMutation,
    updatePreferences: updatePreferencesMutation,
    
    refetchPromoterFollowers,
    refetchUserFollows
  };
}
