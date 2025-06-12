
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { FollowerData } from '@/types/FollowerComponentTypes';

export const useFollowers = (promoterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get followers with safe property access
  const { data: followers = [], isLoading: followersLoading, error } = useQuery({
    queryKey: ['followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          id,
          subscriber_id,
          promoter_id,
          follow_status,
          created_at,
          profiles!promoter_followers_subscriber_id_fkey (
            username,
            display_name,
            avatar_url,
            email
          )
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching followers:', error);
        throw error;
      }

      // Transform data to match FollowerData interface
      return (data || []).map(follower => ({
        id: follower.id,
        subscriber_id: follower.subscriber_id,
        promoter_id: follower.promoter_id,
        follow_status: follower.follow_status as 'active' | 'paused' | 'cancelled',
        created_at: follower.created_at,
        // Safe profile data mapping
        display_name: follower.profiles?.display_name || undefined,
        username: follower.profiles?.username || undefined,
        avatar_url: follower.profiles?.avatar_url || undefined,
        email: follower.profiles?.email || undefined,
        // Default values for optional properties
        tier_id: undefined,
        tier_name: undefined,
        promoter_name: undefined,
        engagement_tier: undefined,
        follower_tier: undefined,
        score_last_updated: undefined,
        last_engagement_at: undefined,
        notification_preferences: {
          events: true,
          promotions: true,
          generalUpdates: true,
          email: true,
          push: false
        },
        gamification_score: 0,
        loyalty_tier_level: 1,
        subscription_start: follower.created_at,
        last_interaction_at: follower.created_at,
        churn_risk_score: 0,
        discovery_source: 'direct',
        discovery_metadata: {},
        engagement_count: 0,
        engagement_score: 0,
        profiles: follower.profiles || undefined
      })) as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Send notification mutation
  const sendNotification = useMutation({
    mutationFn: async ({ 
      followerIds, 
      message, 
      title 
    }: { 
      followerIds: string[]; 
      message: string; 
      title?: string; 
    }) => {
      // Create notifications for each follower
      const notifications = followerIds.map(followerId => ({
        recipient_id: followerId,
        title: title || 'New Notification',
        content: message,
        priority: 'medium' as const,
        metadata: {
          promoter_id: promoterId,
          notification_type: 'bulk_message'
        }
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Notifications Sent",
        description: "Bulk notifications have been sent successfully.",
      });
    },
    onError: (error) => {
      console.error('Error sending notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send notifications. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Remove follower mutation
  const removeFollower = useMutation({
    mutationFn: async (followerId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('id', followerId)
        .eq('promoter_id', promoterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
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

  // Get follower analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['follower-analytics', promoterId],
    queryFn: async () => {
      if (!promoterId) return null;

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get basic counts
      const { count: totalFollowers } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId);

      const { count: newToday } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId)
        .gte('created_at', today);

      const { count: newThisWeek } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId)
        .gte('created_at', weekAgo);

      return {
        totalFollowers: totalFollowers || 0,
        newToday: newToday || 0,
        newThisWeek: newThisWeek || 0,
        growthRate: totalFollowers > 0 ? ((newThisWeek || 0) / totalFollowers) * 100 : 0
      };
    },
    enabled: !!promoterId
  });

  return {
    followers,
    analytics,
    isLoading: followersLoading || analyticsLoading,
    error,
    sendNotification,
    removeFollower
  };
};
