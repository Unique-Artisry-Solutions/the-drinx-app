
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFollowers(promoterId?: string) {
  const queryClient = useQueryClient();

  // Get promoter followers
  const { 
    data: promoterFollowers = [], 
    isLoading: isLoadingPromoterFollowers,
    refetch: refetchPromoterFollowers 
  } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      // If using mock promoter ID, return empty array (will be handled by useSubscriptions)
      if (promoterId === 'mock-promoter-id') {
        return [];
      }
      
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

  // Get user follows/subscriptions
  const { 
    data: userFollows = [], 
    isLoading: isLoadingUserFollows,
    refetch: refetchUserFollows 
  } = useQuery({
    queryKey: ['user-follows', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      // Mock data handling
      if (promoterId === 'mock-promoter-id') {
        return [];
      }
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('promoter_id', promoterId);

      if (error) throw error;
      return data || [];
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
    mutationFn: async (promoterId: string) => {
      console.log('Subscribe action for promoter:', promoterId);
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
