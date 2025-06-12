
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export interface FollowerData {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  follow_status: 'active' | 'paused' | 'cancelled';
  created_at: string;
  profiles?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface FollowerAnalytics {
  totalFollowers: number;
  newToday: number;
  newThisWeek: number;
  growthRate: number;
}

export function useFollowers(promoterId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get followers for a promoter
  const { data: followers = [], isLoading, error } = useQuery({
    queryKey: ['followers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];

      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
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
        throw error;
      }

      return (data || []).map(follower => ({
        id: follower.id,
        subscriber_id: follower.subscriber_id,
        promoter_id: follower.promoter_id,
        follow_status: follower.follow_status,
        created_at: follower.created_at,
        profiles: follower.profiles || undefined
      })) as FollowerData[];
    },
    enabled: !!promoterId
  });

  // Get analytics
  const { data: analytics } = useQuery({
    queryKey: ['follower-analytics', promoterId],
    queryFn: async () => {
      if (!promoterId) return { totalFollowers: 0, newToday: 0, newThisWeek: 0, growthRate: 0 };

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { count: totalFollowers } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

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

      const previousWeek = (totalFollowers || 0) - (newThisWeek || 0);
      const growthRate = previousWeek > 0 ? ((newThisWeek || 0) / previousWeek) * 100 : 0;

      return {
        totalFollowers: totalFollowers || 0,
        newToday: newToday || 0,
        newThisWeek: newThisWeek || 0,
        growthRate: Math.round(growthRate * 100) / 100
      };
    },
    enabled: !!promoterId
  });

  // Send notification to followers
  const sendNotification = useMutation({
    mutationFn: async ({ followerIds, message, title }: { 
      followerIds: string[]; 
      message: string; 
      title?: string; 
    }) => {
      for (const followerId of followerIds) {
        const { error } = await supabase
          .from('notifications')
          .insert({
            recipient_id: followerId,
            recipient_type: 'individual',
            title: title || 'New Message',
            content: message,
            priority: 'medium'
          });

        if (error) {
          console.error('Error sending notification:', error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Messages Sent",
        description: "Your message has been sent to selected followers.",
      });
    },
    onError: (error) => {
      console.error('Error sending notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send messages. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Remove follower
  const removeFollower = useMutation({
    mutationFn: async (subscriberId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('subscriber_id', subscriberId)
        .eq('promoter_id', promoterId);

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
    analytics: analytics || { totalFollowers: 0, newToday: 0, newThisWeek: 0, growthRate: 0 },
    isLoading,
    error,
    sendNotification,
    removeFollower
  };
}
