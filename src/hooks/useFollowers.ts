
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Follower } from '@/types/SubscriptionTypes';

export const useFollowers = (promoterId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followers = [], isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['followers', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('promoter_id', promoterId);

      if (error) throw error;
      return data as Follower[];
    },
    enabled: !!promoterId,
  });

  const { data: followedPromoters = [], isLoading: isLoadingFollowed } = useQuery({
    queryKey: ['followed-promoters'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          id,
          promoter_id,
          subscriber_id,
          subscription_start,
          subscription_end,
          follow_status,
          notification_preferences,
          promoter:promoter_id (
            id,
            display_name,
            username
          )
        `)
        .eq('subscriber_id', user.id);

      if (error) throw error;
      return data || [];
    },
  });

  const follow = useMutation({
    mutationFn: async ({ promoterId }: { promoterId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          subscriber_id: user.id,
          promoter_id: promoterId,
          follow_status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['followed-promoters'] });
      toast({
        title: 'Now following',
        description: 'You are now following this promoter',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Follow action failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const unfollow = useMutation({
    mutationFn: async (followerId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('id', followerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['followed-promoters'] });
      toast({
        title: 'Unfollowed successfully',
        description: 'You have unfollowed this promoter',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Unfollow failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateNotificationPreferences = useMutation({
    mutationFn: async ({ followerId, preferences }: { 
      followerId: string, 
      preferences: { 
        events: boolean, 
        promotions: boolean, 
        announcements: boolean 
      } 
    }) => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .update({
          notification_preferences: preferences
        })
        .eq('id', followerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['followed-promoters'] });
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    followers,
    followedPromoters,
    isLoading: isLoadingFollowers || isLoadingFollowed,
    follow,
    unfollow,
    updateNotificationPreferences,
  };
};
