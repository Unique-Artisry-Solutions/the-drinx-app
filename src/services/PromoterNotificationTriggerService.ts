
import { supabase } from '@/integrations/supabase/client';
import { realTimeFollowerNotificationService } from '@/services/RealTimeFollowerNotificationService';

interface EventUpdateData {
  id: string;
  title: string;
  description?: string;
  eventType: 'created' | 'updated' | 'cancelled';
}

interface PromotionData {
  id: string;
  title: string;
  discountCode?: string;
  expiresAt?: string;
}

interface GeneralUpdateData {
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationResult {
  success: boolean;
  sentCount: number;
  errors?: string[];
}

class PromoterNotificationTriggerServiceClass {
  async triggerEventUpdate(promoterId: string, eventData: EventUpdateData): Promise<NotificationResult> {
    try {
      // Get follower count for this promoter
      const { data: followers, error: followersError } = await supabase
        .from('promoter_followers')
        .select('subscriber_id')
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (followersError) throw followersError;

      const followerCount = followers?.length || 0;

      // Send real-time notification
      const notificationData = {
        notification_type: 'event_update' as const,
        title: `Event ${eventData.eventType}: ${eventData.title}`,
        content: eventData.description || `Event has been ${eventData.eventType}`,
        priority: eventData.eventType === 'cancelled' ? 'urgent' as const : 'medium' as const,
        metadata: {
          event_id: eventData.id,
          event_type: eventData.eventType
        }
      };

      await realTimeFollowerNotificationService.sendRealtimeNotificationToFollowers(
        promoterId,
        notificationData
      );

      return {
        success: true,
        sentCount: followerCount
      };
    } catch (error: any) {
      console.error('Error triggering event update notification:', error);
      return {
        success: false,
        sentCount: 0,
        errors: [error.message]
      };
    }
  }

  async triggerPromotion(promoterId: string, promotionData: PromotionData): Promise<NotificationResult> {
    try {
      // Get follower count for this promoter
      const { data: followers, error: followersError } = await supabase
        .from('promoter_followers')
        .select('subscriber_id')
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (followersError) throw followersError;

      const followerCount = followers?.length || 0;

      // Send real-time notification
      const notificationData = {
        notification_type: 'promotion' as const,
        title: `New Promotion: ${promotionData.title}`,
        content: promotionData.discountCode 
          ? `Use code ${promotionData.discountCode} for special savings!`
          : 'Check out our latest promotion!',
        priority: 'medium' as const,
        metadata: {
          promotion_id: promotionData.id,
          discount_code: promotionData.discountCode
        }
      };

      await realTimeFollowerNotificationService.sendRealtimeNotificationToFollowers(
        promoterId,
        notificationData
      );

      return {
        success: true,
        sentCount: followerCount
      };
    } catch (error: any) {
      console.error('Error triggering promotion notification:', error);
      return {
        success: false,
        sentCount: 0,
        errors: [error.message]
      };
    }
  }

  async triggerGeneralUpdate(promoterId: string, updateData: GeneralUpdateData): Promise<NotificationResult> {
    try {
      // Get follower count for this promoter
      const { data: followers, error: followersError } = await supabase
        .from('promoter_followers')
        .select('subscriber_id')
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (followersError) throw followersError;

      const followerCount = followers?.length || 0;

      // Send real-time notification
      const notificationData = {
        notification_type: 'general_update' as const,
        title: updateData.title,
        content: updateData.content,
        priority: (updateData.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
        metadata: {
          update_type: 'general'
        }
      };

      await realTimeFollowerNotificationService.sendRealtimeNotificationToFollowers(
        promoterId,
        notificationData
      );

      return {
        success: true,
        sentCount: followerCount
      };
    } catch (error: any) {
      console.error('Error triggering general update notification:', error);
      return {
        success: false,
        sentCount: 0,
        errors: [error.message]
      };
    }
  }
}

export const promoterNotificationTriggerService = new PromoterNotificationTriggerServiceClass();
