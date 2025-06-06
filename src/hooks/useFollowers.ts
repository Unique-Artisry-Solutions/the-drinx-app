
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FollowerData {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  tier_id?: string | null;
  subscription_start: string;
  subscription_end?: string | null;
  status: 'active' | 'cancelled' | 'expired';
  follow_status: 'active' | 'paused' | 'cancelled' | 'pending';
  created_at: string;
  promoter_name?: string;
  tier_name?: string;
  notification_preferences?: {
    events: boolean;
    promotions: boolean;
    announcements: boolean;
    email_notifications?: boolean;
    push_notifications?: boolean;
  };
  discovery_source?: string;
  referral_source?: string;
  engagement_count?: number;
  total_interactions?: number;
  last_engagement_at?: string;
  churn_risk_score?: number;
  follower_tier?: string;
}

export function useFollowers(promoterId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all followers for a promoter
  const { data: promoterFollowers, isLoading: promoterLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      if (promoterId === 'mock-promoter-id') {
        return [];
      }

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          promoter_subscription_tiers(name)
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        promoter_id: item.promoter_id,
        subscriber_id: item.subscriber_id,
        tier_id: item.tier_id,
        subscription_start: item.subscription_start || item.created_at,
        subscription_end: item.subscription_end,
        status: item.status || 'active',
        follow_status: item.follow_status || 'active',
        created_at: item.created_at,
        tier_name: item.promoter_subscription_tiers?.name,
        notification_preferences: item.notification_preferences || {
          events: true,
          promotions: true,
          announcements: true
        },
        discovery_source: item.discovery_source,
        referral_source: item.referral_source,
        engagement_count: item.engagement_count || 0,
        total_interactions: item.total_interactions || 0,
        last_engagement_at: item.last_engagement_at,
        churn_risk_score: item.churn_risk_score || 0,
        follower_tier: item.follower_tier || 'new'
      })) as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Get user's follows/subscriptions
  const { data: userFollows, isLoading: userLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          promoter_subscription_tiers(name)
        `)
        .eq('subscriber_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        promoter_id: item.promoter_id,
        subscriber_id: item.subscriber_id,
        tier_id: item.tier_id,
        subscription_start: item.subscription_start || item.created_at,
        subscription_end: item.subscription_end,
        status: item.status || 'active',
        follow_status: item.follow_status || 'active',
        created_at: item.created_at,
        tier_name: item.promoter_subscription_tiers?.name,
        notification_preferences: item.notification_preferences || {
          events: true,
          promotions: true,
          announcements: true
        },
        discovery_source: item.discovery_source,
        referral_source: item.referral_source,
        engagement_count: item.engagement_count || 0,
        total_interactions: item.total_interactions || 0,
        last_engagement_at: item.last_engagement_at,
        churn_risk_score: item.churn_risk_score || 0,
        follower_tier: item.follower_tier || 'new'
      })) as FollowerData[];
    }
  });

  // Follow a promoter (free)
  const follow = useMutation({
    mutationFn: async (promoterId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterId,
          subscriber_id: user.id,
          follow_status: 'active',
          status: 'active',
          subscription_start: new Date().toISOString(),
          notification_preferences: {
            events: true,
            promotions: true,
            announcements: true
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Success',
        description: 'You are now following this promoter!'
      });
    }
  });

  // Subscribe to a paid tier
  const subscribe = useMutation({
    mutationFn: async ({ promoterId, tierId }: { promoterId: string; tierId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterId,
          subscriber_id: user.id,
          tier_id: tierId,
          follow_status: 'active',
          status: 'active',
          subscription_start: new Date().toISOString(),
          notification_preferences: {
            events: true,
            promotions: true,
            announcements: true
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Success',
        description: 'Subscription successful!'
      });
    }
  });

  // Unfollow/unsubscribe
  const unfollow = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .update({
          follow_status: 'cancelled',
          status: 'cancelled',
          subscription_end: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Success',
        description: 'Unfollowed successfully'
      });
    }
  });

  // Communication actions for promoters
  const sendNotification = useMutation({
    mutationFn: async ({ followerId, message }: { followerId: string; message: string }) => {
      console.log('Sending notification to follower:', followerId, message);
      return { success: true };
    }
  });

  const sendFlyer = useMutation({
    mutationFn: async ({ followerId, flyerUrl }: { followerId: string; flyerUrl: string }) => {
      console.log('Sending flyer to follower:', followerId, flyerUrl);
      return { success: true };
    }
  });

  const sendDiscountCode = useMutation({
    mutationFn: async ({ followerId, discountCode }: { followerId: string; discountCode: string }) => {
      console.log('Sending discount code to follower:', followerId, discountCode);
      return { success: true };
    }
  });

  // Update follower preferences
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { 
      followerId: string; 
      preferences: Partial<FollowerData['notification_preferences']> 
    }) => {
      const { error } = await supabase
        .from('promoter_followers')
        .update({ notification_preferences: preferences })
        .eq('id', followerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  return {
    // Data
    promoterFollowers,
    userFollows,
    
    // Loading states
    isLoading: promoterLoading || userLoading,
    
    // Actions
    follow,
    subscribe,
    unfollow,
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    updatePreferences,
    
    // Refetch functions
    refetchPromoterFollowers,
    refetchUserFollows
  };
}
