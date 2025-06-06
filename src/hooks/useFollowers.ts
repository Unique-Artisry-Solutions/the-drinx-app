
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { NotificationPreferences } from '@/types/SubscriptionTypes';

export interface FollowerData {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  tier_id?: string | null;
  engagement_count: number;
  total_interactions: number;
  churn_risk_score: number;
  follower_tier: string;
  last_engagement_at?: string;
  discovery_source?: string;
  discovery_metadata?: any;
  follow_status: string;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
  // Joined data from relations
  promoter_name?: string;
  tier_name?: string;
  profiles?: {
    display_name?: string;
    username?: string;
  };
  promoter_subscription_tiers?: {
    name: string;
    tier: string;
  };
}

interface SendNotificationParams {
  followerId: string;
  message: string;
}

interface SendFlyerParams {
  followerId: string;
  flyerUrl: string;
}

interface SendDiscountCodeParams {
  followerId: string;
  discountCode: string;
}

interface UpdatePreferencesParams {
  followerId: string;
  preferences: NotificationPreferences;
}

// Helper function to safely convert Json to NotificationPreferences
const safeParseNotificationPreferences = (jsonData: any): NotificationPreferences => {
  if (!jsonData || typeof jsonData !== 'object') {
    return {
      events: true,
      promotions: true,
      announcements: true,
      email_notifications: true,
      push_notifications: false
    };
  }
  
  return {
    events: jsonData.events !== false,
    promotions: jsonData.promotions !== false,
    announcements: jsonData.announcements !== false,
    email_notifications: jsonData.email_notifications !== false,
    push_notifications: jsonData.push_notifications === true
  };
};

// Helper function to transform raw Supabase data to FollowerData
const transformFollowerData = (rawData: any[]): FollowerData[] => {
  return rawData.map(item => ({
    id: item.id,
    promoter_id: item.promoter_id,
    subscriber_id: item.subscriber_id,
    tier_id: item.tier_id,
    engagement_count: item.engagement_count,
    total_interactions: item.total_interactions,
    churn_risk_score: item.churn_risk_score,
    follower_tier: item.follower_tier,
    last_engagement_at: item.last_engagement_at,
    discovery_source: item.discovery_source,
    discovery_metadata: item.discovery_metadata,
    follow_status: item.follow_status,
    notification_preferences: safeParseNotificationPreferences(item.notification_preferences),
    created_at: item.created_at,
    updated_at: item.updated_at,
    // Extract joined data
    promoter_name: item.profiles?.display_name || item.profiles?.username || `User ${item.subscriber_id.slice(0, 8)}`,
    tier_name: item.promoter_subscription_tiers?.name || 'Free',
    profiles: item.profiles,
    promoter_subscription_tiers: item.promoter_subscription_tiers
  }));
};

export function useFollowers(promoterId?: string) {
  const queryClient = useQueryClient();

  // Get followers for a promoter
  const { data: promoterFollowers = [], isLoading: isLoadingPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles(display_name, username),
          promoter_subscription_tiers(name, tier)
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return transformFollowerData(data || []);
    },
    enabled: !!promoterId
  });

  // Get user's follows (subscriptions to promoters)
  const { data: userFollows = [], isLoading: isLoadingUserFollows } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles(display_name, username),
          promoter_subscription_tiers(name, tier)
        `)
        .eq('subscriber_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return transformFollowerData(data || []);
    }
  });

  // Follow a promoter
  const follow = useMutation({
    mutationFn: async (promoterId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterId,
          subscriber_id: user.id,
          follow_status: 'active',
          notification_preferences: {
            events: true,
            promotions: true,
            announcements: true,
            email_notifications: true,
            push_notifications: false
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
    }
  });

  // Subscribe to a promoter with tier
  const subscribe = useMutation({
    mutationFn: async ({ promoterId, tierId }: { promoterId: string; tierId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterId,
          subscriber_id: user.id,
          tier_id: tierId,
          follow_status: 'active',
          notification_preferences: {
            events: true,
            promotions: true,
            announcements: true,
            email_notifications: true,
            push_notifications: false
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
    }
  });

  // Unfollow/unsubscribe
  const unfollow = useMutation({
    mutationFn: async (followerId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('id', followerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  // Send notification
  const sendNotification = useMutation({
    mutationFn: async ({ followerId, message }: SendNotificationParams) => {
      console.log(`Sending notification to follower ${followerId}: ${message}`);
      return { success: true };
    }
  });

  // Send flyer
  const sendFlyer = useMutation({
    mutationFn: async ({ followerId, flyerUrl }: SendFlyerParams) => {
      console.log(`Sending flyer to follower ${followerId}: ${flyerUrl}`);
      return { success: true };
    }
  });

  // Send discount code
  const sendDiscountCode = useMutation({
    mutationFn: async ({ followerId, discountCode }: SendDiscountCodeParams) => {
      console.log(`Sending discount code to follower ${followerId}: ${discountCode}`);
      return { success: true };
    }
  });

  // Update preferences
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: UpdatePreferencesParams) => {
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

  const refetchUserFollows = () => {
    queryClient.invalidateQueries({ queryKey: ['user-follows'] });
  };

  const refetchPromoterFollowers = () => {
    queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
  };

  return {
    // Data
    promoterFollowers,
    userFollows,
    
    // Loading states
    isLoading: isLoadingPromoterFollowers || isLoadingUserFollows,
    
    // Actions
    follow,
    subscribe,
    unfollow,
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    updatePreferences,
    
    // Refetch functions
    refetchUserFollows,
    refetchPromoterFollowers
  };
}
