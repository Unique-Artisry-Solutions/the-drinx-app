
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFollowers(promoterId?: string) {
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

  return {
    promoterFollowers,
    userFollows,
    isLoading: isLoadingPromoterFollowers || isLoadingUserFollows,
    
    // Actions (placeholder implementations)
    follow: async () => {
      console.log('Follow action not implemented');
    },
    subscribe: async () => {
      console.log('Subscribe action not implemented');
    },
    unfollow: async () => {
      console.log('Unfollow action not implemented');
    },
    sendNotification: async () => {
      console.log('Send notification action not implemented');
    },
    sendFlyer: async () => {
      console.log('Send flyer action not implemented');
    },
    sendDiscountCode: async () => {
      console.log('Send discount code action not implemented');
    },
    updatePreferences: async () => {
      console.log('Update preferences action not implemented');
    },
    
    refetchPromoterFollowers,
    refetchUserFollows
  };
}
