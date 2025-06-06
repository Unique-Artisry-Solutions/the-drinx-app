import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FollowerData {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  follow_status: 'active' | 'paused' | 'cancelled';
  follower_tier: string;
  tier_name?: string;
  tier_id?: string | null;
  promoter_name?: string;
  engagement_count?: number;
  total_interactions?: number;
  last_engagement_at?: string;
  notification_preferences: {
    events?: boolean;
    promotions?: boolean;
    generalUpdates?: boolean;
    email?: boolean;
    push?: boolean;
  };
  created_at: string;
  updated_at?: string;
  // New engagement scoring fields
  engagement_score?: number;
  engagement_tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  score_last_updated?: string;
  tier_updated_at?: string;
}

export interface UseFollowersProps {
  promoterId?: string;
}

export function useFollowers(promoterId?: string) {
  const queryClient = useQueryClient();

  // Fetch user follows
  const { data: userFollows = [], isLoading: isLoadingUserFollows, refetch: refetchUserFollows } = useQuery({
    queryKey: ['user-follows', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      // If using mock promoter ID, return mock data
      if (promoterId === 'mock-promoter-id') {
        return [];
      }

      const { data, error } = await supabase
        .from('user_promoter_follows')
        .select('*')
        .eq('promoter_id', promoterId);

      if (error) throw error;
      return data as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Fetch promoter followers
  const { data: promoterFollowers = [], isLoading: isLoadingPromoterFollowers, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      // If using mock promoter ID, return mock data
      if (promoterId === 'mock-promoter-id') {
        return [];
      }

      const { data, error } = await supabase
        .from('user_promoter_follows')
        .select('*')
        .eq('promoter_id', promoterId);

      if (error) throw error;
      return data as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Mutation to follow a promoter
  const follow = useMutation({
    mutationFn: async (promoterId: string) => {
      const { data, error } = await supabase
        .from('user_promoter_follows')
        .insert([{ promoter_id: promoterId, subscriber_id: supabase.auth.user()?.id }])
        .select()
        .single();

      if (error) throw error;
      return data as FollowerData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-follows', promoterId]);
      queryClient.invalidateQueries(['promoter-followers', promoterId]);
    },
  });

    // Mutation to subscribe to a promoter (same as follow for now)
    const subscribe = useMutation({
      mutationFn: async (promoterId: string) => {
        const { data, error } = await supabase
          .from('user_promoter_follows')
          .insert([{ promoter_id: promoterId, subscriber_id: supabase.auth.user()?.id }])
          .select()
          .single();
  
        if (error) throw error;
        return data as FollowerData;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['user-follows', promoterId]);
        queryClient.invalidateQueries(['promoter-followers', promoterId]);
      },
    });

  // Mutation to unfollow a promoter
  const unfollow = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('user_promoter_follows')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-follows', promoterId]);
      queryClient.invalidateQueries(['promoter-followers', promoterId]);
    },
  });

  // Mutation to send a notification to a follower
  const sendNotification = useMutation({
    mutationFn: async ({ followerId, message }: { followerId: string, message: string }) => {
      // Simulate sending a notification (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Notification sent to ${followerId}: ${message}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['promoter-followers', promoterId]);
    },
  });

  // Mutation to send a flyer to a follower
  const sendFlyer = useMutation({
    mutationFn: async ({ followerId, flyerUrl }: { followerId: string, flyerUrl: string }) => {
      // Simulate sending a flyer (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Flyer sent to ${followerId}: ${flyerUrl}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['promoter-followers', promoterId]);
    },
  });

  // Mutation to send a discount code to a follower
  const sendDiscountCode = useMutation({
    mutationFn: async ({ followerId, discountCode }: { followerId: string, discountCode: string }) => {
      // Simulate sending a discount code (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Discount code sent to ${followerId}: ${discountCode}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['promoter-followers', promoterId]);
    },
  });

  // Mutation to update notification preferences
  const updatePreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { followerId: string, preferences: any }) => {
      const { data, error } = await supabase
        .from('user_promoter_follows')
        .update({ notification_preferences: preferences })
        .eq('id', followerId)
        .select()
        .single();

      if (error) throw error;
      return data as FollowerData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-follows', promoterId]);
      queryClient.invalidateQueries(['promoter-followers', promoterId]);
    },
  });

  return {
    userFollows,
    promoterFollowers,
    isLoading: isLoadingUserFollows || isLoadingPromoterFollowers,
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
}
