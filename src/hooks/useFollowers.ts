
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { 
  FollowerData, 
  FollowerPreferences, 
  NotificationPayload, 
  BulkNotificationPayload,
  FlyerPayload,
  DiscountPayload
} from '@/types/FollowerComponentTypes';

// Safe conversion function for database responses
const convertToFollowerData = (dbRow: any): FollowerData => {
  return {
    id: dbRow.id || '',
    subscriber_id: dbRow.subscriber_id || dbRow.id || '',
    promoter_id: dbRow.promoter_id || '',
    follow_status: dbRow.follow_status || 'active',
    created_at: dbRow.created_at || new Date().toISOString(),
    tier_id: dbRow.tier_id || null,
    tier_name: dbRow.tier_name || null,
    promoter_name: dbRow.promoter_name || null,
    engagement_tier: dbRow.engagement_tier || null,
    follower_tier: dbRow.follower_tier || null,
    score_last_updated: dbRow.score_last_updated || null,
    last_engagement_at: dbRow.last_engagement_at || null,
    notification_preferences: dbRow.notification_preferences || {
      events: true,
      promotions: true,
      generalUpdates: true,
      email: true,
      push: false,
      sms: false
    },
    gamification_score: dbRow.gamification_score || 0,
    loyalty_tier_level: dbRow.loyalty_tier_level || 0,
    subscription_start: dbRow.subscription_start || dbRow.created_at,
    last_interaction_at: dbRow.last_interaction_at || null,
    display_name: dbRow.display_name || dbRow.profiles?.display_name || null,
    username: dbRow.username || dbRow.profiles?.username || null,
    avatar_url: dbRow.avatar_url || dbRow.profiles?.avatar_url || null,
    email: dbRow.email || dbRow.profiles?.email || null,
    churn_risk_score: dbRow.churn_risk_score || 0,
    discovery_source: dbRow.discovery_source || null,
    discovery_metadata: dbRow.discovery_metadata || {},
    engagement_count: dbRow.engagement_count || 0,
    engagement_score: dbRow.engagement_score || 0,
    profiles: dbRow.profiles || null
  };
};

export function useFollowers(promoterId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Get current user's subscriptions/follows
  const { 
    data: userFollows = [], 
    isLoading: userFollowsLoading, 
    refetch: refetchUserFollows 
  } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles:subscriber_id (
            username,
            display_name,
            avatar_url,
            email
          )
        `)
        .eq('subscriber_id', user.id);

      if (error) {
        console.error('Error fetching user follows:', error);
        return [];
      }

      return (data || []).map(convertToFollowerData);
    },
    enabled: true
  });

  // Get followers for a specific promoter
  const { 
    data: promoterFollowers = [], 
    isLoading: promoterFollowersLoading, 
    refetch: refetchPromoterFollowers 
  } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles:subscriber_id (
            username,
            display_name,
            avatar_url,
            email
          )
        `)
        .eq('promoter_id', promoterId);

      if (error) {
        console.error('Error fetching promoter followers:', error);
        return [];
      }

      return (data || []).map(convertToFollowerData);
    },
    enabled: !!promoterId
  });

  // Follow/Subscribe mutation with proper database columns
  const follow = useMutation({
    mutationFn: async (targetPromoterId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          subscriber_id: user.id,
          promoter_id: targetPromoterId,
          follow_status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return convertToFollowerData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Successfully followed promoter",
      });
    },
    onError: (error) => {
      console.error('Follow error:', error);
      toast({
        title: "Error",
        description: "Failed to follow promoter",
        variant: "destructive"
      });
    }
  });

  // Subscribe with tier mutation
  const subscribe = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId, tierId }: { promoterId: string; tierId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          subscriber_id: user.id,
          promoter_id: targetPromoterId,
          tier_id: tierId,
          follow_status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return convertToFollowerData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Successfully subscribed to promoter",
      });
    },
    onError: (error) => {
      console.error('Subscribe error:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to promoter",
        variant: "destructive"
      });
    }
  });

  // Unfollow mutation
  const unfollow = useMutation({
    mutationFn: async (followId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('id', followId);

      if (error) throw error;
      return followId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Successfully unfollowed promoter",
      });
    },
    onError: (error) => {
      console.error('Unfollow error:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow promoter",
        variant: "destructive"
      });
    }
  });

  // Update preferences mutation with proper JSON handling
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { followerId: string; preferences: FollowerPreferences }) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .update({
          notification_preferences: preferences as any
        })
        .eq('id', followerId)
        .select()
        .single();

      if (error) throw error;
      return convertToFollowerData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    },
    onError: (error) => {
      console.error('Update preferences error:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      });
    }
  });

  // Send notification mutation
  const sendNotification = useMutation({
    mutationFn: async (payload: NotificationPayload) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: payload.followerId,
          title: payload.title || 'Notification',
          content: payload.message,
          metadata: payload.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
    },
    onError: (error) => {
      console.error('Send notification error:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    }
  });

  // Send flyer mutation
  const sendFlyer = useMutation({
    mutationFn: async (payload: FlyerPayload) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: payload.followerId,
          title: 'New Flyer',
          content: 'You have received a new flyer',
          metadata: { 
            type: 'flyer', 
            flyer_url: payload.flyer_url,
            ...payload.metadata 
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Flyer sent successfully",
      });
    },
    onError: (error) => {
      console.error('Send flyer error:', error);
      toast({
        title: "Error",
        description: "Failed to send flyer",
        variant: "destructive"
      });
    }
  });

  // Send discount code mutation
  const sendDiscountCode = useMutation({
    mutationFn: async (payload: DiscountPayload) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: payload.followerId,
          title: 'Discount Code',
          content: `Your discount code: ${payload.discount_code}`,
          metadata: { 
            type: 'discount', 
            discount_code: payload.discount_code,
            ...payload.metadata 
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Discount code sent successfully",
      });
    },
    onError: (error) => {
      console.error('Send discount code error:', error);
      toast({
        title: "Error",
        description: "Failed to send discount code",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    userFollows,
    promoterFollowers,
    
    // Loading states
    isLoading: isLoading || userFollowsLoading || promoterFollowersLoading,
    
    // Actions
    follow,
    subscribe,
    unfollow,
    updatePreferences,
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    
    // Refetch functions
    refetchUserFollows,
    refetchPromoterFollowers
  };
}

export type { FollowerData };
