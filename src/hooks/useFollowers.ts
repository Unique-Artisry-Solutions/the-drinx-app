
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { FollowerData, FollowerPreferences, NotificationPayload, FlyerPayload, DiscountPayload } from '@/types/FollowerComponentTypes';

export { type FollowerData };

export function useFollowers(promoterId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user follows (subscriptions/followers from user perspective)
  const { data: userFollows = [], isLoading: userFollowsLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!promoter_followers_user_id_fkey (
            username,
            display_name,
            avatar_url,
            email
          )
        `)
        .order('followed_at', { ascending: false });

      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        promoter_id: item.promoter_id,
        followed_at: item.followed_at,
        notifications_enabled: item.notifications_enabled || false,
        engagement_score: item.engagement_score || 0,
        subscriber_id: item.user_id,
        follow_status: 'active' as const,
        created_at: item.followed_at,
        status: 'active' as const,
        engagement_count: item.engagement_count || 0,
        churn_risk_score: item.churn_risk_score || 0,
        discovery_source: item.discovery_source || 'direct',
        discovery_metadata: item.discovery_metadata || {},
        engagement_tier: item.engagement_tier || 'bronze',
        tier_name: item.engagement_tier || 'bronze',
        gamification_score: item.gamification_score || 0,
        loyalty_tier_level: item.loyalty_tier_level || 1,
        subscription_start: item.followed_at,
        last_interaction_at: item.last_interaction_at || item.followed_at,
        profiles: item.profiles ? {
          username: item.profiles.username,
          display_name: item.profiles.display_name,
          avatar_url: item.profiles.avatar_url,
          email: item.profiles.email
        } : undefined
      })) as FollowerData[];
    }
  });

  // Get promoter followers (followers from promoter perspective)
  const { data: promoterFollowers = [], isLoading: promoterFollowersLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!promoter_followers_user_id_fkey (
            username,
            display_name,
            avatar_url,
            email
          )
        `)
        .eq('promoter_id', promoterId)
        .order('followed_at', { ascending: false });

      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        promoter_id: item.promoter_id,
        followed_at: item.followed_at,
        notifications_enabled: item.notifications_enabled || false,
        engagement_score: item.engagement_score || 0,
        subscriber_id: item.user_id,
        follow_status: 'active' as const,
        created_at: item.followed_at,
        status: 'active' as const,
        engagement_count: item.engagement_count || 0,
        churn_risk_score: item.churn_risk_score || 0,
        discovery_source: item.discovery_source || 'direct',
        discovery_metadata: item.discovery_metadata || {},
        engagement_tier: item.engagement_tier || 'bronze',
        tier_name: item.engagement_tier || 'bronze',
        gamification_score: item.gamification_score || 0,
        loyalty_tier_level: item.loyalty_tier_level || 1,
        subscription_start: item.followed_at,
        last_interaction_at: item.last_interaction_at || item.followed_at,
        profiles: item.profiles ? {
          username: item.profiles.username,
          display_name: item.profiles.display_name,
          avatar_url: item.profiles.avatar_url,
          email: item.profiles.email
        } : undefined
      })) as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Follow mutation
  const follow = useMutation({
    mutationFn: async (targetPromoterId: string) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: targetPromoterId,
          followed_at: new Date().toISOString(),
          notifications_enabled: true
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
        title: "Success",
        description: "Successfully followed promoter",
      });
    },
    onError: (error) => {
      console.error('Error following promoter:', error);
      toast({
        title: "Error",
        description: "Failed to follow promoter. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Subscribe mutation (enhanced follow)
  const subscribe = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId, tierId }: { promoterId: string; tierId?: string }) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: targetPromoterId,
          followed_at: new Date().toISOString(),
          notifications_enabled: true,
          tier_id: tierId
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
        title: "Success",
        description: "Successfully subscribed to promoter",
      });
    },
    onError: (error) => {
      console.error('Error subscribing to promoter:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to promoter. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Unfollow mutation
  const unfollow = useMutation({
    mutationFn: async (followRecordId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('id', followRecordId);

      if (error) throw error;
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
      console.error('Error unfollowing promoter:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow promoter. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Communication mutations (mock implementations)
  const sendNotification = useMutation({
    mutationFn: async (payload: NotificationPayload) => {
      console.log('Sending notification:', payload);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Notification Sent",
        description: "Notification sent successfully to follower",
      });
    }
  });

  const sendFlyer = useMutation({
    mutationFn: async (payload: FlyerPayload) => {
      console.log('Sending flyer:', payload);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Flyer Sent",
        description: "Flyer sent successfully to follower",
      });
    }
  });

  const sendDiscountCode = useMutation({
    mutationFn: async (payload: DiscountPayload) => {
      console.log('Sending discount code:', payload);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Discount Code Sent",
        description: "Discount code sent successfully to follower",
      });
    }
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { followerId: string; preferences: FollowerPreferences }) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .update({ 
          notification_preferences: preferences,
          notifications_enabled: preferences.events || preferences.promotions || preferences.generalUpdates
        })
        .eq('id', followerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Preferences Updated",
        description: "Notification preferences updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    userFollows,
    promoterFollowers,
    
    // Loading states
    isLoading: userFollowsLoading || promoterFollowersLoading,
    
    // Actions
    follow,
    subscribe,
    unfollow,
    
    // Communication
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    
    // Preferences
    updatePreferences,
    
    // Refetch functions
    refetchUserFollows,
    refetchPromoterFollowers
  };
}
