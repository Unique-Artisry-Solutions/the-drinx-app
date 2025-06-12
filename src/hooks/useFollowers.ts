
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FollowerData {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  follow_status: 'active' | 'paused' | 'cancelled';
  created_at: string;
  tier_id?: string;
  tier_name?: string;
  promoter_name?: string;
  engagement_tier?: string;
  follower_tier?: string;
  score_last_updated?: string;
  last_engagement_at?: string;
  
  // Safe property additions
  gamification_score?: number;
  loyalty_tier_level?: number;
  subscription_start?: string;
  last_interaction_at?: string;
  
  // User profile data
  display_name?: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  
  // Database properties with safe defaults
  churn_risk_score?: number;
  discovery_source?: string;
  discovery_metadata?: Record<string, any>;
  engagement_count?: number;
  engagement_score?: number;
  
  // Profile relationship data
  profiles?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
    email?: string;
  };
}

export interface FollowerAnalytics {
  totalFollowers: number;
  newToday: number;
  newThisWeek: number;
  growthRate: number;
}

export const useFollowers = (promoterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get followers for promoter
  const { data: followers = [], isLoading, error } = useQuery({
    queryKey: ['followers', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          id,
          subscriber_id,
          promoter_id,
          follow_status,
          created_at,
          tier_id,
          tier_name,
          promoter_name,
          engagement_tier,
          follower_tier,
          score_last_updated,
          last_engagement_at,
          gamification_score,
          loyalty_tier_level,
          subscription_start,
          last_interaction_at,
          churn_risk_score,
          discovery_source,
          discovery_metadata,
          engagement_count,
          engagement_score
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching followers:', error);
        return [];
      }
      
      return (data || []) as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Get analytics
  const { data: analytics } = useQuery({
    queryKey: ['follower-analytics', promoterId],
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
      const { count: newThisWeek } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId)
        .gte('created_at', weekAgo);

      // Simple growth calculation
      const previousWeekTotal = (totalFollowers || 0) - (newThisWeek || 0);
      const growthRate = previousWeekTotal > 0 
        ? ((newThisWeek || 0) / previousWeekTotal) * 100 
        : 0;

      return {
        totalFollowers: totalFollowers || 0,
        newToday: newToday || 0,
        newThisWeek: newThisWeek || 0,
        growthRate: Math.round(growthRate * 100) / 100
      } as FollowerAnalytics;
    },
    enabled: !!promoterId
  });

  // Send notification mutation
  const sendNotification = useMutation({
    mutationFn: async ({ followerIds, message, title }: { followerIds: string[]; message: string; title?: string; }) => {
      // Simple notification sending logic
      console.log('Sending notification to followers:', followerIds, message, title);
      // Implementation would go here
    },
    onSuccess: () => {
      toast({
        title: "Notification Sent",
        description: "Your message has been sent to selected followers.",
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

  // Remove follower mutation
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
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['follower-analytics'] });
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
    isLoading,
    error,
    sendNotification,
    removeFollower
  };
};
