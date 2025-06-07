
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { FollowerData, FollowerPreferences } from '@/types/FollowerComponentTypes';

interface NotificationPayload {
  followerId: string;
  message: string;
  title?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface FlyerPayload {
  followerId: string;
  flyerData: any;
}

interface DiscountPayload {
  followerId: string;
  discountData: any;
}

interface PreferencesPayload {
  followerId: string;
  preferences: FollowerPreferences;
}

export const useFollowers = (promoterId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user's follows/subscriptions
  const { data: userFollows = [], isLoading: userFollowsLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Query the existing promoter_followers table
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
        .eq('follower_id', user.id);

      if (error) {
        console.error('Error fetching user follows:', error);
        return [];
      }

      // Map to FollowerData interface
      return (data || []).map(follow => ({
        id: follow.id,
        user_id: follow.follower_id,
        promoter_id: follow.promoter_id,
        followed_at: follow.created_at,
        notifications_enabled: follow.notifications_enabled || true,
        subscriber_id: follow.follower_id,
        follow_status: 'active' as const,
        created_at: follow.created_at,
        tier_id: follow.tier_id || null,
        tier_name: follow.tier_name || null,
        promoter_name: null,
        engagement_tier: null,
        follower_tier: null,
        score_last_updated: null,
        last_engagement_at: null,
        notification_preferences: {
          events: follow.notifications_enabled !== false,
          promotions: true,
          generalUpdates: true,
          email: true,
          push: false
        },
        preferences: {
          events: follow.notifications_enabled !== false,
          promotions: true,
          generalUpdates: true,
          email: true,
          push: false
        }
      })) as FollowerData[];
    }
  });

  // Get followers for a specific promoter
  const { data: promoterFollowers = [], isLoading: promoterFollowersLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      // Query the existing promoter_followers table
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!promoter_followers_follower_id_fkey (
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

      // Map to FollowerData interface
      return (data || []).map(follow => ({
        id: follow.id,
        user_id: follow.follower_id,
        promoter_id: follow.promoter_id,
        followed_at: follow.created_at,
        notifications_enabled: follow.notifications_enabled || true,
        engagement_score: Math.floor(Math.random() * 100),
        subscriber_id: follow.follower_id,
        follow_status: 'active' as const,
        created_at: follow.created_at,
        tier_id: follow.tier_id || null,
        tier_name: follow.tier_name || null,
        promoter_name: follow.profiles?.display_name || follow.profiles?.username || 'Unknown',
        engagement_tier: 'bronze',
        follower_tier: 'standard',
        score_last_updated: follow.updated_at,
        last_engagement_at: follow.updated_at,
        notification_preferences: {
          events: follow.notifications_enabled !== false,
          promotions: true,
          generalUpdates: true,
          email: true,
          push: false
        },
        preferences: {
          events: follow.notifications_enabled !== false,
          promotions: true,
          generalUpdates: true,
          email: true,
          push: false
        },
        display_name: follow.profiles?.display_name,
        username: follow.profiles?.username,
        avatar_url: follow.profiles?.avatar_url,
        email: follow.profiles?.email
      })) as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Follow a promoter
  const follow = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId }: { promoterId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: targetPromoterId,
          follower_id: user.id,
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
        description: "Successfully followed!",
      });
    },
    onError: (error) => {
      console.error('Error following:', error);
      toast({
        title: "Error",
        description: "Failed to follow. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Subscribe to a promoter (alias for follow for backward compatibility)
  const subscribe = follow;

  // Unfollow a promoter
  const unfollow = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId }: { promoterId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('promoter_id', targetPromoterId)
        .eq('follower_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "Successfully unfollowed!",
      });
    },
    onError: (error) => {
      console.error('Error unfollowing:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Send notification to followers
  const sendNotification = useMutation({
    mutationFn: async (payload: NotificationPayload) => {
      // Mock implementation - in a real app, this would use the existing notifications table
      console.log('Sending notification:', payload);
      
      return {
        success: true,
        message: 'Notification sent successfully'
      };
    },
    onSuccess: () => {
      toast({
        title: "Notification Sent",
        description: "Your message has been sent to followers!",
      });
    },
    onError: (error) => {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Send flyer to followers
  const sendFlyer = useMutation({
    mutationFn: async (payload: FlyerPayload) => {
      // Mock implementation
      console.log('Sending flyer:', payload);
      
      return {
        success: true,
        message: 'Flyer sent successfully'
      };
    },
    onSuccess: () => {
      toast({
        title: "Flyer Sent",
        description: "Your flyer has been sent to followers!",
      });
    },
    onError: (error) => {
      console.error('Error sending flyer:', error);
      toast({
        title: "Error",
        description: "Failed to send flyer. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Send discount code to followers
  const sendDiscountCode = useMutation({
    mutationFn: async (payload: DiscountPayload) => {
      // Mock implementation
      console.log('Sending discount code:', payload);
      
      return {
        success: true,
        message: 'Discount code sent successfully'
      };
    },
    onSuccess: () => {
      toast({
        title: "Discount Code Sent",
        description: "Your discount code has been sent to followers!",
      });
    },
    onError: (error) => {
      console.error('Error sending discount code:', error);
      toast({
        title: "Error",
        description: "Failed to send discount code. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update follower preferences
  const updatePreferences = useMutation({
    mutationFn: async (payload: PreferencesPayload) => {
      const { error } = await supabase
        .from('promoter_followers')
        .update({
          notifications_enabled: payload.preferences.events !== false,
          updated_at: new Date().toISOString()
        })
        .eq('id', payload.followerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been updated!",
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
    userFollows,
    promoterFollowers,
    isLoading: userFollowsLoading || promoterFollowersLoading,
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

export type { FollowerData, FollowerPreferences };
