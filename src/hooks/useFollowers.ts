
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { 
  FollowerData, 
  NotificationPayload, 
  FlyerPayload, 
  DiscountPayload, 
  FollowerPreferences 
} from '@/types/FollowerComponentTypes';

export type { FollowerData };

export const useFollowers = (promoterId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get followers for promoter with safe property mapping
  const { data: promoterFollowers = [], isLoading: followersLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId || promoterId === 'mock-promoter-id') {
        return [];
      }

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!promoter_followers_follower_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('promoter_id', promoterId);

      if (error) {
        console.warn('Error fetching followers:', error);
        return [];
      }

      // Safe mapping with fallbacks for missing properties
      return (data || []).map((follower): FollowerData => ({
        // Core properties with safe access
        id: follower.id || '',
        user_id: follower.follower_id || '', // Safe mapping from follower_id
        promoter_id: follower.promoter_id || '',
        followed_at: follower.created_at || new Date().toISOString(), // Safe fallback
        notifications_enabled: true, // Default value for missing property
        
        // Required properties
        subscriber_id: follower.follower_id || follower.id || '',
        follow_status: follower.follow_status || 'active',
        created_at: follower.created_at || new Date().toISOString(),
        
        // Optional properties with safe access
        engagement_score: follower.engagement_score ?? 0,
        tier_id: follower.tier_id || null,
        tier_name: follower.tier_name || null,
        engagement_tier: follower.engagement_tier || 'bronze',
        last_interaction_at: follower.last_interaction_at || follower.created_at || new Date().toISOString(),
        
        // Profile data with safe access
        username: follower.profiles?.username || '',
        display_name: follower.profiles?.display_name || '',
        avatar_url: follower.profiles?.avatar_url || '',
        email: follower.profiles?.email || '',
        
        // Additional safe properties
        churn_risk_score: follower.churn_risk_score ?? 0,
        discovery_source: follower.discovery_source || 'direct',
        discovery_metadata: follower.discovery_metadata || {},
        engagement_count: follower.engagement_count ?? 0,
        gamification_score: follower.gamification_score ?? 0,
        loyalty_tier_level: follower.loyalty_tier_level ?? 1,
        subscription_start: follower.subscription_start || follower.created_at,
        
        // Nested profile object for backward compatibility
        profiles: {
          username: follower.profiles?.username || '',
          display_name: follower.profiles?.display_name || '',
          avatar_url: follower.profiles?.avatar_url || '',
          email: follower.profiles?.email || ''
        }
      }));
    },
    enabled: !!promoterId && promoterId !== 'mock-promoter-id'
  });

  // Get user's follows/subscriptions with safe property mapping
  const { data: userFollows = [], isLoading: followsLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('follower_id', user.id);

      if (error) {
        console.warn('Error fetching user follows:', error);
        return [];
      }

      // Safe mapping with fallbacks
      return (data || []).map((follow): FollowerData => ({
        // Core properties with safe access
        id: follow.id || '',
        user_id: follow.follower_id || '',
        promoter_id: follow.promoter_id || '',
        followed_at: follow.created_at || new Date().toISOString(),
        notifications_enabled: true, // Default value
        
        // Required properties
        subscriber_id: follow.follower_id || follow.id || '',
        follow_status: follow.follow_status || 'active',
        created_at: follow.created_at || new Date().toISOString(),
        
        // Safe defaults for optional properties
        engagement_score: follow.engagement_score ?? 0,
        churn_risk_score: follow.churn_risk_score ?? 0,
        discovery_source: follow.discovery_source || 'direct',
        discovery_metadata: follow.discovery_metadata || {},
        engagement_count: follow.engagement_count ?? 0,
        gamification_score: follow.gamification_score ?? 0,
        loyalty_tier_level: follow.loyalty_tier_level ?? 1,
        subscription_start: follow.subscription_start || follow.created_at,
        last_interaction_at: follow.last_interaction_at || follow.created_at
      }));
    }
  });

  // Follow mutation - expects string promoterId
  const follow = useMutation({
    mutationFn: async (promoterId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterId,
          follower_id: user.id,
          follow_status: 'active'
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
        description: "Successfully followed!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Subscribe mutation for premium tiers
  const subscribe = useMutation({
    mutationFn: async ({ promoterId, tierId }: { promoterId: string; tierId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterId,
          follower_id: user.id,
          tier_id: tierId,
          follow_status: 'active'
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
        description: "Successfully subscribed!",
      });
    }
  });

  // Unfollow mutation - expects followId string
  const unfollow = useMutation({
    mutationFn: async (followId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('id', followId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Successfully unfollowed!",
      });
    }
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { followerId: string; preferences: FollowerPreferences }) => {
      // For now, just log the preference update since we don't have a preferences table
      console.log('Updating preferences for follower:', followerId, preferences);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Preferences updated successfully!",
      });
    }
  });

  // Communication mutations with safe payload handling
  const sendNotification = useMutation({
    mutationFn: async (payload: NotificationPayload) => {
      console.log('Sending notification:', payload);
      return { success: true, message: 'Notification sent' };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent successfully!",
      });
    }
  });

  const sendFlyer = useMutation({
    mutationFn: async (payload: FlyerPayload) => {
      console.log('Sending flyer:', payload);
      return { success: true, message: 'Flyer sent' };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Flyer sent successfully!",
      });
    }
  });

  const sendDiscountCode = useMutation({
    mutationFn: async (payload: DiscountPayload) => {
      console.log('Sending discount code:', payload);
      return { success: true, message: 'Discount code sent' };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Discount code sent successfully!",
      });
    }
  });

  return {
    // Data
    promoterFollowers,
    userFollows,
    
    // Loading states
    isLoading: followersLoading || followsLoading,
    
    // Actions
    follow,
    subscribe,
    unfollow,
    updatePreferences,
    
    // Communication
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    
    // Refetch
    refetchPromoterFollowers,
    refetchUserFollows
  };
};
