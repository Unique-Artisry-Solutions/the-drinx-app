
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';
import type { NotificationPreferences } from '@/types/SubscriptionTypes';

export interface FollowerData {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  tier_id?: string;
  follow_status: 'active' | 'paused' | 'cancelled' | 'pending';
  created_at: string;
  updated_at: string;
  engagement_count: number;
  total_interactions: number;
  churn_risk_score: number;
  follower_tier: string;
  last_engagement_at?: string;
  discovery_source?: string;
  discovery_metadata?: Record<string, any>;
  notification_preferences: NotificationPreferences;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
  promoter_subscription_tiers?: {
    name: string;
    price: number;
    tier: string;
  };
}

export function useFollowers(promoterId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  console.log('useFollowers - promoterId:', promoterId);
  console.log('useFollowers - user:', user?.id);

  // Get followers for a promoter (when user is the promoter)
  const { data: promoterFollowers = [], isLoading: isLoadingPromoterFollowers, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      console.log('Fetching promoter followers for:', promoterId);
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!promoter_followers_subscriber_id_fkey(display_name, avatar_url),
          promoter_subscription_tiers!promoter_followers_tier_id_fkey(name, price, tier)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promoter followers:', error);
        throw error;
      }
      
      console.log('Promoter followers data:', data);
      return data as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Get user's follows (when user is following promoters)
  const { data: userFollows = [], isLoading: isLoadingUserFollows, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching user follows for:', user.id);
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!promoter_followers_promoter_id_fkey(display_name, avatar_url),
          promoter_subscription_tiers!promoter_followers_tier_id_fkey(name, price, tier)
        `)
        .eq('subscriber_id', user.id)
        .eq('follow_status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user follows:', error);
        throw error;
      }
      
      console.log('User follows data:', data);
      return data as FollowerData[];
    },
    enabled: !!user?.id
  });

  // Follow a promoter
  const follow = useMutation({
    mutationFn: async (promoterIdToFollow: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('Following promoter:', promoterIdToFollow);
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterIdToFollow,
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

  // Subscribe to a promoter tier
  const subscribe = useMutation({
    mutationFn: async (params: { promoterId: string; tierId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('Subscribing to promoter tier:', params);
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: params.promoterId,
          subscriber_id: user.id,
          tier_id: params.tierId,
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
      console.log('Unfollowing/unsubscribing:', followerId);
      
      const { error } = await supabase
        .from('promoter_followers')
        .update({ follow_status: 'cancelled' })
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
    mutationFn: async (params: { followerId: string; message: string }) => {
      console.log('Sending notification:', params);
      
      // This would integrate with your notification system
      // For now, just log the action
      return { success: true };
    }
  });

  // Send flyer
  const sendFlyer = useMutation({
    mutationFn: async (params: { followerId: string; flyerUrl: string }) => {
      console.log('Sending flyer:', params);
      
      // This would integrate with your flyer system
      return { success: true };
    }
  });

  // Send discount code
  const sendDiscountCode = useMutation({
    mutationFn: async (params: { followerId: string; discountCode: string }) => {
      console.log('Sending discount code:', params);
      
      // This would integrate with your discount system
      return { success: true };
    }
  });

  // Update preferences
  const updatePreferences = useMutation({
    mutationFn: async (params: { followerId: string; preferences: Partial<NotificationPreferences> }) => {
      console.log('Updating preferences:', params);
      
      const { error } = await supabase
        .from('promoter_followers')
        .update({ 
          notification_preferences: params.preferences 
        })
        .eq('id', params.followerId);

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
    refetchPromoterFollowers,
    refetchUserFollows
  };
}
