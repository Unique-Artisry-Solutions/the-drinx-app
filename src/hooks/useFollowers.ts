import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the correct follower type based on the actual database schema
export interface FollowerData {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  tier_id?: string | null;
  follow_status: 'active' | 'paused' | 'cancelled' | 'pending';
  subscription_start: string;
  subscription_end?: string | null;
  created_at: string;
  updated_at: string;
  notification_preferences?: any;
  promoter_name?: string;
  tier_name?: string;
}

export function useFollowers(promoterId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Define query key constants
  const USER_FOLLOWS_KEY = ['user-follows'];
  const PROMOTER_FOLLOWERS_KEY = ['promoter-followers'];

  // Get user's follows/subscriptions
  const { data: userFollows = [], isLoading: userFollowsLoading, refetch: refetchUserFollows } = useQuery({
    queryKey: [USER_FOLLOWS_KEY],
    queryFn: async () => {
      // Mock data for now - replace with actual query when database is ready
      const mockUserFollows: FollowerData[] = [
        {
          id: 'follow-1',
          promoter_id: 'mock-promoter-id',
          subscriber_id: 'mock-user-id',
          tier_id: null,
          follow_status: 'active' as const,
          subscription_start: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notification_preferences: { events: true, promotions: true },
          promoter_name: 'Sample Promoter'
        }
      ];
      return mockUserFollows;
    },
    enabled: true
  });

  // Get followers for a promoter
  const { data: promoterFollowers = [], isLoading: promoterFollowersLoading, refetch: refetchPromoterFollowers } = useQuery({
    queryKey: [PROMOTER_FOLLOWERS_KEY, promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      // Mock data for now - replace with actual query when database is ready
      const mockFollowers: FollowerData[] = [
        {
          id: 'follower-1',
          promoter_id: promoterId,
          subscriber_id: 'user-1',
          tier_id: null,
          follow_status: 'active' as const,
          subscription_start: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notification_preferences: { events: true, promotions: true },
          promoter_name: 'User One'
        },
        {
          id: 'follower-2',
          promoter_id: promoterId,
          subscriber_id: 'user-2',
          tier_id: 'tier-1',
          follow_status: 'active' as const,
          subscription_start: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notification_preferences: { events: true, promotions: false },
          promoter_name: 'User Two',
          tier_name: 'Premium'
        }
      ];
      return mockFollowers;
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
    isLoading: userFollowsLoading || promoterFollowersLoading,
    
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
