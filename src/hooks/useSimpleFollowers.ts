
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SimpleFollower {
  id: string;
  follower_id: string;
  followed_at: string;
  follower_profile?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface FollowerAnalytics {
  total_followers: number;
  new_followers_today: number;
  new_followers_week: number;
  growth_percentage: number;
}

export const useSimpleFollowers = (promoterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get followers for promoter - using subscriber_id instead of follower_id
  const { data: followers = [], isLoading: followersLoading } = useQuery({
    queryKey: ['simple-followers', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          id,
          subscriber_id,
          created_at,
          profiles!promoter_followers_subscriber_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching followers:', error);
        return [];
      }
      
      // Transform the data to match SimpleFollower interface
      return (data || []).map(follower => ({
        id: follower.id,
        follower_id: follower.subscriber_id,
        followed_at: follower.created_at,
        follower_profile: follower.profiles || undefined
      })) as SimpleFollower[];
    },
    enabled: !!promoterId
  });

  // Get basic analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['simple-follower-analytics', promoterId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get total followers
      const { count: totalFollowers } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId);

      // Get new followers today
      const { count: newToday } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId)
        .gte('created_at', today);

      // Get new followers this week
      const { count: newWeek } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId)
        .gte('created_at', weekAgo);

      // Simple growth calculation
      const previousWeekTotal = (totalFollowers || 0) - (newWeek || 0);
      const growthPercentage = previousWeekTotal > 0 
        ? ((newWeek || 0) / previousWeekTotal) * 100 
        : 0;

      return {
        total_followers: totalFollowers || 0,
        new_followers_today: newToday || 0,
        new_followers_week: newWeek || 0,
        growth_percentage: Math.round(growthPercentage * 100) / 100
      } as FollowerAnalytics;
    },
    enabled: !!promoterId
  });

  // Remove follower mutation - using subscriber_id
  const removeFollower = useMutation({
    mutationFn: async (subscriberId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('promoter_id', promoterId)
        .eq('subscriber_id', subscriberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simple-followers'] });
      queryClient.invalidateQueries({ queryKey: ['simple-follower-analytics'] });
      toast({
        title: "Follower Removed",
        description: "The follower has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Error removing follower:', error);
      toast({
        title: "Error",
        description: "Failed to remove follower. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    followers,
    analytics,
    isLoading: followersLoading || analyticsLoading,
    removeFollower
  };
};
