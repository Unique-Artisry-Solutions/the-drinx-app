import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToFollowerPreferences } from '@/utils/followerTypeUtils';
import { FollowerNotificationRequest, NotificationResult } from '@/types/FollowerNotificationTypes';

export function useFollowerNotifications(promoterId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get follower segments for targeting
  const { data: segments = [], isLoading: segmentsLoading } = useQuery({
    queryKey: ['follower-segments', promoterId],
    queryFn: async () => {
      const { data: followers, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          promoter_subscription_tiers!inner(name, tier)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (error) throw error;

      const segments = [
        {
          id: 'all' as const,
          name: 'All Followers',
          type: 'all' as const,
          count: followers?.length || 0
        }
      ];

      // Group by tiers if any exist
      const tierCounts = new Map<string, number>();
      followers?.forEach(follower => {
        const tierData = follower.promoter_subscription_tiers;
        if (tierData && Array.isArray(tierData) && tierData.length > 0) {
          const tierName = tierData[0].tier;
          if (tierName) {
            tierCounts.set(tierName, (tierCounts.get(tierName) || 0) + 1);
          }
        }
      });

      tierCounts.forEach((count, tierName) => {
        segments.push({
          id: `tier-${tierName}`,
          name: `${tierName} Tier`,
          type: 'tier' as const,
          count,
          criteria: { tier: tierName }
        });
      });

      return segments;
    },
    enabled: !!promoterId
  });

  // Get notification preferences for a user
  const getNotificationPreferences = async (userId: string) => {
    const { data, error } = await supabase
      .from('promoter_followers')
      .select('notification_preferences')
      .eq('subscriber_id', userId)
      .eq('promoter_id', promoterId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data?.notification_preferences) {
      return safeJsonToFollowerPreferences(data.notification_preferences);
    }

    return null;
  };

  // Send bulk notification to followers
  const sendBulkNotification = useMutation({
    mutationFn: async (request: FollowerNotificationRequest): Promise<NotificationResult> => {
      // Get target followers
      let query = supabase
        .from('promoter_followers')
        .select(`
          subscriber_id,
          notification_preferences,
          promoter_subscription_tiers!inner(tier)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      const { data: followers, error: followersError } = await query;
      if (followersError) throw followersError;

      if (!followers || followers.length === 0) {
        return {
          success: true,
          sentCount: 0,
          errors: ['No followers found']
        };
      }

      // Filter by tier if specified
      let targetFollowers = followers;
      if (request.targetType === 'tier' && request.specificTiers?.length) {
        targetFollowers = followers.filter(follower => {
          const tierData = follower.promoter_subscription_tiers;
          if (Array.isArray(tierData) && tierData.length > 0) {
            return request.specificTiers?.includes(tierData[0].tier);
          }
          return false;
        });
      }

      // Send notifications
      let sentCount = 0;
      const errors: string[] = [];

      for (const follower of targetFollowers) {
        try {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              recipient_id: follower.subscriber_id,
              recipient_type: 'individual',
              title: request.title,
              content: request.message,
              priority: request.priority,
              metadata: {
                promoter_id: promoterId,
                notification_type: 'follower_communication',
                discount_code: request.discountCode || null,
                target_type: request.targetType,
                include_email: request.includeEmail,
                include_push: request.includePush
              }
            });

          if (notificationError) {
            errors.push(`Failed to notify follower: ${notificationError.message}`);
          } else {
            sentCount++;
          }
        } catch (err: any) {
          errors.push(`Failed to notify follower: ${err.message}`);
        }
      }

      return {
        success: sentCount > 0,
        sentCount,
        errors: errors.length > 0 ? errors : undefined
      };
    },
    onSuccess: (result) => {
      toast({
        title: 'Notification Sent',
        description: `Successfully sent to ${result.sentCount} followers`,
      });
      queryClient.invalidateQueries({ queryKey: ['follower-segments', promoterId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send notification',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Schedule notification (placeholder for future implementation)
  const scheduleNotification = useMutation({
    mutationFn: async (data: any) => {
      // For now, just use the regular notifications table
      // In future, we can create a separate scheduled_notifications table
      console.log('Scheduling notification:', data);
      throw new Error('Scheduled notifications not yet implemented');
    },
    onSuccess: () => {
      toast({
        title: 'Notification Scheduled',
        description: 'Your notification has been scheduled successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to schedule notification',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    segments,
    isLoading: segmentsLoading,
    getNotificationPreferences,
    sendBulkNotification,
    scheduleNotification
  };
}
