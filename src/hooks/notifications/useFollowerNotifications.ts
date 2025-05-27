
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FollowerNotificationPreferences {
  events: boolean;
  discounts: boolean;
  updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: 'immediate' | 'daily' | 'weekly';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export const useFollowerNotifications = (promoterId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendFollowerUpdate = useCallback(async (updateData: {
    title: string;
    content: string;
    type: 'event' | 'discount' | 'update';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    includeEmail?: boolean;
    includePush?: boolean;
  }) => {
    setIsLoading(true);
    try {
      // Get all active followers
      const { data: followers, error: followersError } = await supabase
        .from('promoter_followers')
        .select(`
          subscriber_id,
          notification_preferences,
          promoter_subscription_tiers!inner(tier)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (followersError) throw followersError;

      if (!followers || followers.length === 0) {
        toast({
          title: 'No Followers',
          description: 'You have no active followers to notify.',
          variant: 'destructive'
        });
        return { success: false, sentCount: 0 };
      }

      // Filter followers based on their notification preferences
      const eligibleFollowers = followers.filter(follower => {
        const prefs = follower.notification_preferences as FollowerNotificationPreferences;
        if (!prefs) return true; // Default to enabled if no preferences set
        
        // Check if they want this type of notification
        switch (updateData.type) {
          case 'event':
            return prefs.events !== false;
          case 'discount':
            return prefs.discounts !== false;
          case 'update':
            return prefs.updates !== false;
          default:
            return true;
        }
      });

      let sentCount = 0;
      const errors: string[] = [];

      // Send notifications to eligible followers
      for (const follower of eligibleFollowers) {
        try {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              recipient_id: follower.subscriber_id,
              recipient_type: 'individual',
              title: updateData.title,
              content: updateData.content,
              priority: updateData.priority,
              metadata: {
                promoter_id: promoterId,
                notification_type: 'follower_update',
                update_type: updateData.type,
                include_email: updateData.includeEmail ?? true,
                include_push: updateData.includePush ?? true
              }
            });

          if (notificationError) {
            errors.push(`Failed to notify follower ${follower.subscriber_id}: ${notificationError.message}`);
          } else {
            sentCount++;
          }
        } catch (err: any) {
          errors.push(`Failed to notify follower ${follower.subscriber_id}: ${err.message}`);
        }
      }

      const result = {
        success: sentCount > 0,
        sentCount,
        totalFollowers: followers.length,
        eligibleFollowers: eligibleFollowers.length,
        errors: errors.length > 0 ? errors : undefined
      };

      if (result.success) {
        toast({
          title: 'Notifications Sent',
          description: `Successfully notified ${sentCount} out of ${eligibleFollowers.length} eligible followers.`,
        });
      } else {
        toast({
          title: 'Failed to Send',
          description: 'No notifications were sent successfully.',
          variant: 'destructive'
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error sending follower notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to send follower notifications',
        variant: 'destructive'
      });
      return { success: false, sentCount: 0 };
    } finally {
      setIsLoading(false);
    }
  }, [promoterId, toast]);

  const scheduleFollowerNotification = useCallback(async (notificationData: {
    title: string;
    content: string;
    type: 'event' | 'discount' | 'update';
    scheduledFor: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }) => {
    setIsLoading(true);
    try {
      // Store scheduled notification
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          promoter_id: promoterId,
          title: notificationData.title,
          content: notificationData.content,
          notification_type: notificationData.type,
          scheduled_for: notificationData.scheduledFor.toISOString(),
          priority: notificationData.priority,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: 'Notification Scheduled',
        description: `Notification scheduled for ${notificationData.scheduledFor.toLocaleDateString()}`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error scheduling notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule notification',
        variant: 'destructive'
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [promoterId, toast]);

  const batchNotifications = useCallback(async (notifications: Array<{
    title: string;
    content: string;
    type: 'event' | 'discount' | 'update';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>) => {
    setIsLoading(true);
    try {
      const results = [];
      
      // Process notifications with a small delay to prevent overwhelming users
      for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        const result = await sendFollowerUpdate(notification);
        results.push(result);
        
        // Add a small delay between notifications
        if (i < notifications.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const totalSent = results.reduce((sum, result) => sum + result.sentCount, 0);
      
      toast({
        title: 'Batch Notifications Complete',
        description: `Sent ${totalSent} notifications across ${notifications.length} batches.`,
      });

      return { success: true, results };
    } catch (error: any) {
      console.error('Error sending batch notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to send batch notifications',
        variant: 'destructive'
      });
      return { success: false, results: [] };
    } finally {
      setIsLoading(false);
    }
  }, [sendFollowerUpdate, toast]);

  return {
    isLoading,
    sendFollowerUpdate,
    scheduleFollowerNotification,
    batchNotifications
  };
};
