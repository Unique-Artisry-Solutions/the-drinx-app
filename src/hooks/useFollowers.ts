
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define the correct follower type based on the actual database schema
export interface FollowerData {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  follow_status: 'active' | 'paused' | 'cancelled';
  created_at: string;
  subscription_start: string;
  subscription_end: string | null;
  tier_id: string | null;
  updated_at: string;
  notification_preferences: {
    events: boolean;
    promotions: boolean;
    generalUpdates: boolean;
  };
  tier_name?: string | null;
  promoter_name?: string;
}

export function useFollowers(promoterId?: string) {
  const queryClient = useQueryClient();

  // Get promoter followers using the correct table
  const { 
    data: promoterFollowers = [], 
    isLoading: isLoadingPromoterFollowers,
    refetch: refetchPromoterFollowers 
  } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async (): Promise<FollowerData[]> => {
      if (!promoterId) return [];
      
      // If using mock promoter ID, return mock data
      if (promoterId === 'mock-promoter-id') {
        return [
          {
            id: 'mock-follower-1',
            subscriber_id: 'user-123',
            promoter_id: 'mock-promoter-id',
            follow_status: 'active',
            created_at: new Date().toISOString(),
            subscription_start: new Date().toISOString(),
            subscription_end: null,
            tier_id: null,
            updated_at: new Date().toISOString(),
            notification_preferences: {
              events: true,
              promotions: true,
              generalUpdates: true
            },
            tier_name: null,
            promoter_name: 'Sample Promoter'
          },
          {
            id: 'mock-follower-2',
            subscriber_id: 'user-456',
            promoter_id: 'mock-promoter-id',
            follow_status: 'active',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            subscription_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            subscription_end: null,
            tier_id: 'premium-tier',
            updated_at: new Date().toISOString(),
            notification_preferences: {
              events: true,
              promotions: false,
              generalUpdates: true
            },
            tier_name: 'Premium',
            promoter_name: 'Sample Promoter'
          }
        ];
      }
      
      // Use the correct table name that exists in the database
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (error) throw error;
      return data || [];
    },
    enabled: !!promoterId
  });

  // Get user follows/subscriptions - return mock data for compatibility
  const { 
    data: userFollows = [], 
    isLoading: isLoadingUserFollows,
    refetch: refetchUserFollows 
  } = useQuery({
    queryKey: ['user-follows', promoterId],
    queryFn: async (): Promise<FollowerData[]> => {
      if (!promoterId) return [];
      
      // Return empty array for now since we're focusing on promoter followers
      return [];
    },
    enabled: !!promoterId
  });

  // Mutation for following a promoter
  const followMutation = useMutation({
    mutationFn: async (promoterId: string) => {
      console.log('Follow action for promoter:', promoterId);
      // Implementation would go here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  // Mutation for subscribing to a promoter
  const subscribeMutation = useMutation({
    mutationFn: async (data: { promoterId: string; tierId?: string }) => {
      console.log('Subscribe action:', data);
      // Implementation would go here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
    }
  });

  // Mutation for unfollowing a promoter
  const unfollowMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      console.log('Unfollow action for subscription:', subscriptionId);
      // Implementation would go here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  // Mutation for sending notifications
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: { message: string; followers: string[] }) => {
      console.log('Send notification:', data);
      // Implementation would go here
      return { success: true };
    }
  });

  // Mutation for sending flyers
  const sendFlyerMutation = useMutation({
    mutationFn: async (data: { flyerId: string; followers: string[] }) => {
      console.log('Send flyer:', data);
      // Implementation would go here
      return { success: true };
    }
  });

  // Mutation for sending discount codes
  const sendDiscountCodeMutation = useMutation({
    mutationFn: async (data: { code: string; followers: string[] }) => {
      console.log('Send discount code:', data);
      // Implementation would go here
      return { success: true };
    }
  });

  // Mutation for updating preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: { subscriptionId: string; preferences: any }) => {
      console.log('Update preferences:', data);
      // Implementation would go here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
    }
  });

  return {
    promoterFollowers,
    userFollows,
    isLoading: isLoadingPromoterFollowers || isLoadingUserFollows,
    
    // Mutations
    follow: followMutation,
    subscribe: subscribeMutation,
    unfollow: unfollowMutation,
    sendNotification: sendNotificationMutation,
    sendFlyer: sendFlyerMutation,
    sendDiscountCode: sendDiscountCodeMutation,
    updatePreferences: updatePreferencesMutation,
    
    refetchPromoterFollowers,
    refetchUserFollows
  };
}
