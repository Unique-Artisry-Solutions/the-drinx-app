
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

// Safe database conversion utility
const safeConvertFollowerData = (dbRecord: any): FollowerData => {
  const profiles = dbRecord.profiles || {};
  
  return {
    // Core properties
    id: dbRecord.subscriber_id || dbRecord.id || '',
    user_id: dbRecord.user_id || '',
    promoter_id: dbRecord.promoter_id || '',
    followed_at: dbRecord.created_at || '',
    notifications_enabled: dbRecord.notifications_enabled ?? true,
    engagement_score: dbRecord.engagement_score || 0,
    preferences: dbRecord.notification_preferences || null,
    last_seen: dbRecord.last_seen || '',
    status: (['active', 'paused', 'cancelled'].includes(dbRecord.follow_status) 
      ? dbRecord.follow_status 
      : 'active') as 'active' | 'paused' | 'cancelled',
    tier: dbRecord.tier_name || dbRecord.engagement_tier || '',
    
    // Database column mappings
    subscriber_id: dbRecord.subscriber_id || dbRecord.id || '',
    follow_status: (['active', 'paused', 'cancelled'].includes(dbRecord.follow_status) 
      ? dbRecord.follow_status 
      : 'active') as 'active' | 'paused' | 'cancelled',
    created_at: dbRecord.created_at || '',
    tier_id: dbRecord.tier_id || '',
    tier_name: dbRecord.tier_name || dbRecord.engagement_tier || '',
    promoter_name: dbRecord.promoter_name || '',
    engagement_tier: dbRecord.engagement_tier || '',
    follower_tier: dbRecord.follower_tier || '',
    score_last_updated: dbRecord.score_last_updated || '',
    last_engagement_at: dbRecord.last_engagement_at || '',
    notification_preferences: dbRecord.notification_preferences || null,
    
    // Safe property additions
    gamification_score: dbRecord.gamification_score || 0,
    loyalty_tier_level: dbRecord.loyalty_tier_level || 0,
    subscription_start: dbRecord.subscription_start || '',
    last_interaction_at: dbRecord.last_interaction_at || '',
    
    // User profile data with safe access
    display_name: profiles?.display_name || '',
    username: profiles?.username || '',
    avatar_url: profiles?.avatar_url || '',
    email: profiles?.email || '',
    
    // Database properties with safe defaults
    churn_risk_score: dbRecord.churn_risk_score || 0,
    discovery_source: dbRecord.discovery_source || '',
    discovery_metadata: (typeof dbRecord.discovery_metadata === 'object' 
      ? dbRecord.discovery_metadata 
      : {}) as Record<string, any>,
    engagement_count: dbRecord.engagement_count || 0,
    
    // Profile relationship data
    profiles: {
      username: profiles?.username || '',
      display_name: profiles?.display_name || '',
      avatar_url: profiles?.avatar_url || '',
      email: profiles?.email || ''
    }
  };
};

export const useFollowers = (promoterId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get followers for a promoter
  const { data: promoterFollowers = [], isLoading: promoterLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId || promoterId === 'mock-promoter-id') {
        return [];
      }
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles(username, display_name, avatar_url, email)
        `)
        .eq('promoter_id', promoterId);

      if (error) {
        console.warn('Error fetching promoter followers:', error);
        return [];
      }

      return (data || []).map(safeConvertFollowerData);
    },
    enabled: !!promoterId
  });

  // Get user's follows/subscriptions
  const { data: userFollows = [], isLoading: userLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.warn('Error fetching user follows:', error);
        return [];
      }

      return (data || []).map(safeConvertFollowerData);
    }
  });

  // Follow mutation
  const follow = useMutation({
    mutationFn: async (targetPromoterId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be authenticated to follow');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          user_id: user.id,
          promoter_id: targetPromoterId,
          follow_status: 'active',
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
        description: "Successfully followed promoter"
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to follow promoter",
        variant: "destructive"
      });
    }
  });

  // Subscribe mutation (with tier)
  const subscribe = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId, tierId }: { promoterId: string; tierId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be authenticated to subscribe');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          user_id: user.id,
          promoter_id: targetPromoterId,
          tier_id: tierId,
          follow_status: 'active',
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
        description: "Successfully subscribed to promoter"
      });
    }
  });

  // Unfollow mutation
  const unfollow = useMutation({
    mutationFn: async (followId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('subscriber_id', followId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Successfully unfollowed promoter"
      });
    }
  });

  // Communication mutations
  const sendNotification = useMutation({
    mutationFn: async (payload: NotificationPayload) => {
      console.log('Sending notification:', payload);
      return { success: true };
    }
  });

  const sendFlyer = useMutation({
    mutationFn: async (payload: FlyerPayload) => {
      console.log('Sending flyer:', payload);
      return { success: true };
    }
  });

  const sendDiscountCode = useMutation({
    mutationFn: async (payload: DiscountPayload) => {
      console.log('Sending discount code:', payload);
      return { success: true };
    }
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { followerId: string; preferences: FollowerPreferences }) => {
      const { error } = await supabase
        .from('promoter_followers')
        .update({ notification_preferences: preferences })
        .eq('subscriber_id', followerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  return {
    promoterFollowers,
    userFollows,
    isLoading: promoterLoading || userLoading,
    follow,
    subscribe,
    unfollow,
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    updatePreferences,
    refetchUserFollows,
    refetchPromoterFollowers
  };
};

export type { FollowerData };
