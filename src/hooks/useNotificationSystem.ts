
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Define the allowed notification channel types
export type NotificationChannel = 'push' | 'in_app' | 'email';

export interface NotificationPreference {
  id: string;
  user_id: string;
  category_id: string;
  channels: NotificationChannel[];
  is_enabled: boolean;
}

export interface Notification {
  id: string;
  recipient_id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category_id?: string;
  is_read: boolean;
  created_at: string;
  notification_categories?: {
    name: string;
    description: string;
  } | null;
}

export const useNotificationSystem = () => {
  const { toast } = useToast();

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updatePreferences = useCallback(async (
    categoryId: string,
    channels: NotificationChannel[],
    isEnabled: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ 
          channels,
          is_enabled: isEnabled
        })
        .eq('category_id', categoryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  }, [toast]);

  const sendSegmentNotification = useCallback(async (
    segmentId: string,
    title: string,
    content: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    categoryId?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const { data: segmentMembers, error: membersError } = await supabase
        .from('audience_segment_memberships')
        .select('user_id')
        .eq('segment_id', segmentId)
        .eq('is_active', true);

      if (membersError) throw membersError;

      if (!segmentMembers || segmentMembers.length === 0) {
        console.warn('No members found in segment:', segmentId);
        return;
      }

      // Prepare batch notifications for members
      const notifications = segmentMembers.map(member => ({
        recipient_id: member.user_id,
        title,
        content,
        priority,
        category_id: categoryId,
        metadata: {
          ...metadata,
          segment_id: segmentId,
          is_segment_notification: true
        }
      }));

      // Insert notifications in batches to avoid hitting limits
      const batchSize = 100;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('notifications')
          .insert(batch);

        if (insertError) {
          console.error(`Error sending notifications for batch ${i}:`, insertError);
        }
      }

      toast({
        title: "Success",
        description: `Sent notification to ${notifications.length} segment members`,
      });

      return notifications.length;
    } catch (error) {
      console.error('Error sending segment notification:', error);
      toast({
        title: "Error",
        description: "Failed to send segment notification",
        variant: "destructive",
      });
      return 0;
    }
  }, [toast]);

  const sendMarketingNotification = useCallback(async (
    campaignId: string,
    segmentId?: string,
    abTestInfo?: { variant: 'A' | 'B', distribution: number }
  ) => {
    try {
      // First get campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('event_marketing_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError) throw campaignError;
      
      let title = campaign.name;
      let content: string;
      
      // Handle A/B testing variations
      if (abTestInfo && campaign.target_audience?.abTest) {
        const abTest = campaign.target_audience.abTest;
        content = abTestInfo.variant === 'A' ? abTest.variantA : abTest.variantB;
      } else {
        content = campaign.description;
      }
      
      // Determine recipients based on segment
      const targetSegmentId = segmentId || campaign.target_audience?.segmentId;
      
      if (targetSegmentId) {
        const sentCount = await sendSegmentNotification(
          targetSegmentId,
          title,
          content,
          'medium',
          undefined, // Use default category
          { campaign_id: campaignId, marketing: true }
        );
        
        // Update campaign metrics
        if (sentCount > 0) {
          const { data: metrics } = await supabase
            .from('event_marketing_campaigns')
            .select('metrics')
            .eq('id', campaignId)
            .single();
            
          const updatedMetrics = {
            ...(metrics?.metrics || {}),
            notifications_sent: ((metrics?.metrics?.notifications_sent || 0) + sentCount),
            segments: {
              ...(metrics?.metrics?.segments || {}),
              [targetSegmentId]: {
                ...(metrics?.metrics?.segments?.[targetSegmentId] || {}),
                notifications_sent: ((metrics?.metrics?.segments?.[targetSegmentId]?.notifications_sent || 0) + sentCount)
              }
            }
          };
          
          // If A/B testing, update those metrics too
          if (abTestInfo) {
            const variantKey = abTestInfo.variant === 'A' ? 'variantA' : 'variantB';
            updatedMetrics.abTest = {
              ...(metrics?.metrics?.abTest || { variantA: {}, variantB: {} }),
              [variantKey]: {
                ...(metrics?.metrics?.abTest?.[variantKey] || {}),
                notifications_sent: ((metrics?.metrics?.abTest?.[variantKey]?.notifications_sent || 0) + sentCount)
              }
            };
          }
          
          await supabase
            .from('event_marketing_campaigns')
            .update({ metrics: updatedMetrics })
            .eq('id', campaignId);
        }
        
        return sentCount;
      } else {
        // If no segment, just return 0 - we don't send to everyone automatically
        console.warn('No segment specified for marketing notification');
        return 0;
      }
    } catch (error) {
      console.error('Error sending marketing notification:', error);
      toast({
        title: "Error",
        description: "Failed to send marketing notification",
        variant: "destructive",
      });
      return 0;
    }
  }, [toast, sendSegmentNotification]);

  return {
    markAsRead,
    updatePreferences,
    sendSegmentNotification,
    sendMarketingNotification
  };
};
