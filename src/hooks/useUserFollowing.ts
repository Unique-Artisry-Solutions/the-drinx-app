
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export interface FollowedPromoter {
  id: string;
  promoter_id: string;
  followed_at: string;
  promoter_profile?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
  };
  follower_count?: number;
}

export interface FollowingStats {
  total_following: number;
  recent_follows: number;
  weekly_activity: number;
}

export const useUserFollowing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get promoters the user follows
  const { data: followedPromoters = [], isLoading } = useQuery({
    queryKey: ['user-following', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          id,
          promoter_id,
          created_at,
          profiles!promoter_followers_promoter_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('subscriber_id', user.id)
        .eq('follow_status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching followed promoters:', error);
        return [];
      }

      // Get follower counts for each promoter
      const promotersWithCounts = await Promise.all(
        (data || []).map(async (follow) => {
          const { count } = await supabase
            .from('promoter_followers')
            .select('*', { count: 'exact' })
            .eq('promoter_id', follow.promoter_id)
            .eq('follow_status', 'active');

          return {
            id: follow.id,
            promoter_id: follow.promoter_id,
            followed_at: follow.created_at,
            promoter_profile: follow.profiles || undefined,
            follower_count: count || 0
          } as FollowedPromoter;
        })
      );

      return promotersWithCounts;
    },
    enabled: !!user
  });

  // Get following statistics
  const { data: stats } = useQuery({
    queryKey: ['user-following-stats', user?.id],
    queryFn: async () => {
      if (!user) return { total_following: 0, recent_follows: 0, weekly_activity: 0 };

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { count: totalFollowing } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('subscriber_id', user.id)
        .eq('follow_status', 'active');

      const { count: recentFollows } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('subscriber_id', user.id)
        .gte('created_at', today);

      const { count: weeklyActivity } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('subscriber_id', user.id)
        .gte('created_at', weekAgo);

      return {
        total_following: totalFollowing || 0,
        recent_follows: recentFollows || 0,
        weekly_activity: weeklyActivity || 0
      } as FollowingStats;
    },
    enabled: !!user
  });

  // Unfollow mutation
  const unfollowPromoter = useMutation({
    mutationFn: async (promoterId: string) => {
      if (!user) throw new Error('User must be logged in');

      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('promoter_id', promoterId)
        .eq('subscriber_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-following'] });
      queryClient.invalidateQueries({ queryKey: ['user-following-stats'] });
      queryClient.invalidateQueries({ queryKey: ['follower-count'] });
      toast({
        title: 'Unfollowed Successfully',
        description: 'You have unfollowed the promoter.',
      });
    },
    onError: (error) => {
      console.error('Error unfollowing promoter:', error);
      toast({
        title: 'Error',
        description: 'Failed to unfollow promoter. Please try again.',
        variant: 'destructive'
      });
    }
  });

  return {
    followedPromoters,
    stats: stats || { total_following: 0, recent_follows: 0, weekly_activity: 0 },
    isLoading,
    unfollowPromoter
  };
};
