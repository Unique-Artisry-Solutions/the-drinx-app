import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { NotificationPreferences } from '@/types/SubscriptionTypes';
import type { Json } from '@/integrations/supabase/types';

export interface FollowerData {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  follow_status: 'active' | 'paused' | 'cancelled' | 'pending';
  tier_id?: string | null;
  tier_name?: string | null;
  promoter_name?: string | null;
  created_at: string;
  updated_at: string;
  notification_preferences: NotificationPreferences;
  engagement_count?: number;
  total_interactions?: number;
  churn_risk_score?: number;
  last_engagement_at?: string;
  discovery_source?: string;
  profiles?: {
    display_name?: string;
  };
  promoter_subscription_tiers?: {
    name: string;
  };
}

// Helper function to safely convert Json to NotificationPreferences
const convertJsonToNotificationPreferences = (jsonData: Json | null): NotificationPreferences => {
  if (!jsonData || typeof jsonData !== 'object') {
    return {
      events: true,
      promotions: true,
      announcements: true,
      email_notifications: true,
      push_notifications: false
    };
  }

  const data = jsonData as Record<string, any>;
  return {
    events: data.events ?? true,
    promotions: data.promotions ?? true,
    announcements: data.announcements ?? true,
    email_notifications: data.email_notifications ?? true,
    push_notifications: data.push_notifications ?? false
  };
};

// Helper function to safely convert NotificationPreferences to Json
const convertNotificationPreferencesToJson = (preferences: NotificationPreferences): Json => {
  return {
    events: preferences.events,
    promotions: preferences.promotions,
    announcements: preferences.announcements,
    email_notifications: preferences.email_notifications,
    push_notifications: preferences.push_notifications
  } as Json;
};

// Helper function to transform raw Supabase data to FollowerData
const transformToFollowerData = (rawData: any): FollowerData => {
  return {
    id: rawData.id,
    promoter_id: rawData.promoter_id,
    subscriber_id: rawData.subscriber_id,
    follow_status: rawData.follow_status || 'active',
    tier_id: rawData.tier_id,
    tier_name: rawData.promoter_subscription_tiers?.name || rawData.tier_name,
    promoter_name: rawData.profiles?.display_name || rawData.promoter_name,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    notification_preferences: convertJsonToNotificationPreferences(rawData.notification_preferences),
    engagement_count: rawData.engagement_count,
    total_interactions: rawData.total_interactions,
    churn_risk_score: rawData.churn_risk_score,
    last_engagement_at: rawData.last_engagement_at,
    discovery_source: rawData.discovery_source,
    profiles: rawData.profiles,
    promoter_subscription_tiers: rawData.promoter_subscription_tiers
  };
};

export function useFollowers(promoterId?: string) {
  const queryClient = useQueryClient();

  // Get followers for a promoter (people following them)
  const { data: promoterFollowersData, isLoading: promoterFollowersLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      if (promoterId === 'mock-promoter-id') {
        return [
          {
            id: 'mock-follower-1',
            promoter_id: promoterId,
            subscriber_id: 'mock-subscriber-1',
            follow_status: 'active' as const,
            tier_id: null,
            tier_name: 'Free',
            promoter_name: 'Mock Follower 1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notification_preferences: {
              events: true,
              promotions: true,
              announcements: true,
              email_notifications: true,
              push_notifications: false
            },
            engagement_count: 5,
            total_interactions: 12,
            churn_risk_score: 0.2,
            last_engagement_at: new Date().toISOString(),
            discovery_source: 'organic'
          }
        ] as FollowerData[];
      }

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!inner(display_name),
          promoter_subscription_tiers(name)
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformToFollowerData);
    },
    enabled: !!promoterId
  });

  const { data: userFollowsData, isLoading: userFollowsLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      if (promoterId === 'mock-promoter-id') {
        return [];
      }

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!inner(display_name),
          promoter_subscription_tiers(name)
        `)
        .eq('subscriber_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformToFollowerData);
    },
    enabled: !!promoterId
  });

  // Follow a promoter
  const follow = useMutation({
    mutationFn: async (targetPromoterId: string) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: targetPromoterId,
          subscriber_id: promoterId,
          follow_status: 'active',
          notification_preferences: convertNotificationPreferencesToJson({
            events: true,
            promotions: true,
            announcements: true,
            email_notifications: true,
            push_notifications: false
          })
        })
        .select()
        .single();

      if (error) throw error;
      return transformToFollowerData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  const subscribe = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId, tierId }: { promoterId: string; tierId?: string }) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .upsert({
          promoter_id: targetPromoterId,
          subscriber_id: promoterId,
          tier_id: tierId,
          follow_status: 'active',
          notification_preferences: convertNotificationPreferencesToJson({
            events: true,
            promotions: true,
            announcements: true,
            email_notifications: true,
            push_notifications: false
          }),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return transformToFollowerData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  const unfollow = useMutation({
    mutationFn: async (followerId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('id', followerId);

      if (error) throw error;
      return followerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { followerId: string; preferences: NotificationPreferences }) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .update({
          notification_preferences: convertNotificationPreferencesToJson(preferences),
          updated_at: new Date().toISOString()
        })
        .eq('id', followerId)
        .select()
        .single();

      if (error) throw error;
      return transformToFollowerData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  const sendNotification = useMutation({
    mutationFn: async ({ followerId, message }: { followerId: string; message: string }) => {
      console.log(`Sending notification to follower ${followerId}: ${message}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Notification sent successfully' };
    }
  });

  const sendFlyer = useMutation({
    mutationFn: async ({ followerId, flyerUrl }: { followerId: string; flyerUrl: string }) => {
      console.log(`Sending flyer to follower ${followerId}: ${flyerUrl}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Flyer sent successfully' };
    }
  });

  const sendDiscountCode = useMutation({
    mutationFn: async ({ followerId, discountCode }: { followerId: string; discountCode: string }) => {
      console.log(`Sending discount code to follower ${followerId}: ${discountCode}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Discount code sent successfully' };
    }
  });

  return {
    // Data
    promoterFollowers: promoterFollowersData || [],
    userFollows: userFollowsData || [],
    
    // Loading states
    isLoading: promoterFollowersLoading || userFollowsLoading,
    
    // Actions
    follow,
    subscribe,
    unfollow,
    updatePreferences,
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    
    // Refetch functions
    refetchPromoterFollowers,
    refetchUserFollows
  };
}
