
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { FollowerData } from '@/types/FollowerComponentTypes';

export { type FollowerData } from '@/types/FollowerComponentTypes';

export function useFollowers(promoterId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's follows/subscriptions
  const { data: userFollows = [], isLoading: userFollowsLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows'],
    queryFn: async () => {
      // Use promoter_followers table instead of user_promoter_follows
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('*');

      if (error) {
        console.error('Error fetching user follows:', error);
        return [];
      }
      return data || [];
    }
  });

  // Get promoter's followers
  const { data: promoterFollowers = [], isLoading: promoterFollowersLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          profiles!inner(display_name, username, avatar_url)
        `)
        .eq('promoter_id', promoterId);

      if (error) {
        console.error('Error fetching promoter followers:', error);
        return [];
      }

      // Map to FollowerData interface with all required properties
      return (data || []).map(follower => ({
        id: follower.id,
        user_id: follower.user_id,
        promoter_id: follower.promoter_id,
        followed_at: follower.followed_at,
        notifications_enabled: follower.notifications_enabled || false,
        engagement_score: follower.engagement_score || 0,
        preferences: follower.preferences || {
          events: true,
          promotions: true,
          generalUpdates: true,
          email: true,
          push: false
        },
        last_seen: follower.last_seen,
        status: follower.status || 'active',
        tier: follower.tier,
        // New properties with defaults
        gamification_score: follower.gamification_score || 0,
        loyalty_tier_level: follower.loyalty_tier_level || 1,
        subscription_start: follower.subscription_start || follower.followed_at,
        last_interaction_at: follower.last_interaction_at || follower.followed_at,
        // Profile data
        display_name: follower.profiles?.display_name,
        username: follower.profiles?.username,
        avatar_url: follower.profiles?.avatar_url
      })) as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Follow mutation
  const follow = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId }: { promoterId: string }) => {
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
        description: "You are now following this promoter!",
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

  // Subscribe mutation (alias for follow for backward compatibility)
  const subscribe = follow;

  // Unfollow mutation
  const unfollow = useMutation({
    mutationFn: async ({ promoterId: targetPromoterId }: { promoterId: string }) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('promoter_id', targetPromoterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Success",
        description: "You have unfollowed this promoter.",
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

  // Send notification mutation
  const sendNotification = useMutation({
    mutationFn: async ({ 
      followerId, 
      message 
    }: { 
      followerId: string; 
      message: string; 
    }) => {
      // Mock implementation for now
      console.log('Sending notification to follower:', followerId, message);
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Notification Sent",
        description: "Your message has been sent to the follower.",
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

  // Send flyer mutation
  const sendFlyer = useMutation({
    mutationFn: async ({ followerId, flyerData }: { followerId: string; flyerData: any }) => {
      console.log('Sending flyer to follower:', followerId, flyerData);
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Flyer Sent",
        description: "Your flyer has been sent successfully.",
      });
    }
  });

  // Send discount code mutation
  const sendDiscountCode = useMutation({
    mutationFn: async ({ followerId, discountCode }: { followerId: string; discountCode: string }) => {
      console.log('Sending discount code to follower:', followerId, discountCode);
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Discount Code Sent",
        description: "Your discount code has been sent successfully.",
      });
    }
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { followerId: string; preferences: any }) => {
      const { error } = await supabase
        .from('promoter_followers')
        .update({ preferences })
        .eq('id', followerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: "Preferences Updated",
        description: "Follower preferences have been updated successfully.",
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
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    updatePreferences,
    
    // Refetch functions
    refetchUserFollows,
    refetchPromoterFollowers
  };
}
