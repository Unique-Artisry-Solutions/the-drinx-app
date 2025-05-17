import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Follower } from '@/types/SubscriptionTypes'; 

export const usePromoterFollowers = (promoterId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: followedPromoters = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];
      
      // If promoterId is provided, get followers for that promoter
      // Otherwise, get all promoters that the user follows
      const query = promoterId 
        ? supabase
            .from('promoter_followers')
            .select(`
              id, 
              subscriber_id, 
              promoter_id, 
              subscription_start,
              subscription_end,
              follow_status,
              created_at,
              updated_at,
              notification_preferences,
              profiles:promoter_id(display_name)
            `)
            .eq('promoter_id', promoterId)
        : supabase
            .from('promoter_followers')
            .select(`
              id, 
              subscriber_id, 
              promoter_id, 
              subscription_start,
              subscription_end,
              follow_status,
              created_at,
              updated_at,
              notification_preferences,
              promoter:promoter_id(display_name)
            `)
            .eq('subscriber_id', user.id)
            .eq('follow_status', 'active');
            
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        promoter_name: item.promoter?.display_name || null
      })) as Follower[];
    },
    enabled: !!promoterId || true
  });
  
  // Mutation to follow a promoter
  const follow = useMutation({
    mutationFn: async ({ promoterId }: { promoterId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          subscriber_id: user.id,
          promoter_id: promoterId,
          follow_status: 'active',
          notification_preferences: {
            events: true,
            promotions: true,
            announcements: true
          }
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Followed successfully',
        description: 'You are now following this promoter'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Follow failed',
        description: error.message || 'Could not follow promoter',
        variant: 'destructive'
      });
    }
  });
  
  // Mutation to unfollow a promoter
  const unfollow = useMutation({
    mutationFn: async (followerId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .update({
          follow_status: 'cancelled',
          subscription_end: new Date().toISOString()
        })
        .eq('id', followerId);
        
      if (error) throw error;
      
      return followerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Unfollowed',
        description: 'You have unfollowed this promoter'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Unfollow failed',
        description: error.message || 'Could not unfollow promoter',
        variant: 'destructive'
      });
    }
  });

  return {
    followedPromoters,
    isLoading,
    isError,
    error,
    refetch,
    follow,
    unfollow
  };
};
