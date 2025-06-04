
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from '@/services/NotificationService';

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

      // Send notification using NotificationService
      NotificationService.addNotification({
        title: `Event ${eventData.eventType}: ${eventData.title}`,
        message: eventData.description || `Event has been ${eventData.eventType}`,
        type: eventData.eventType === 'cancelled' ? 'error' : 'info',
        metadata: {
          event_id: eventData.id,
          event_type: eventData.eventType,
          promoter_id: promoterId
        }
      });

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

      // Send notification using NotificationService
      NotificationService.addNotification({
        title: `New Promotion: ${promotionData.title}`,
        message: promotionData.discountCode 
          ? `Use code ${promotionData.discountCode} for special savings!`
          : 'Check out our latest promotion!',
        type: 'success',
        metadata: {
          promotion_id: promotionData.id,
          discount_code: promotionData.discountCode,
          promoter_id: promoterId
        }
      });

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

      // Send notification using NotificationService
      NotificationService.addNotification({
        title: updateData.title,
        message: updateData.content,
        type: updateData.priority === 'urgent' ? 'error' : 'info',
        metadata: {
          update_type: 'general',
          promoter_id: promoterId,
          priority: updateData.priority
        }
      });

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
