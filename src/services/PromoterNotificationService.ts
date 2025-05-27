
import { supabase } from '@/integrations/supabase/client';
import { FollowerSegment, FollowerNotificationRequest, NotificationResult } from '@/types/FollowerNotificationTypes';
import type { Json } from '@/integrations/supabase/types';

class PromoterNotificationServiceClass {
  async getFollowerSegments(promoterId: string): Promise<FollowerSegment[]> {
    try {
      // Get all followers for this promoter
      const { data: followers, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          promoter_subscription_tiers!inner(name, tier)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (error) throw error;

      const segments: FollowerSegment[] = [];

      // All followers segment
      segments.push({
        id: 'all',
        name: 'All Followers',
        type: 'all',
        count: followers?.length || 0
      });

      // Group by tiers
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

      // Add tier segments
      tierCounts.forEach((count, tierName) => {
        segments.push({
          id: `tier-${tierName}`,
          name: `${tierName} Tier`,
          type: 'tier',
          count,
          criteria: { tier: tierName }
        });
      });

      return segments;
    } catch (error: any) {
      console.error('Error fetching follower segments:', error);
      return [];
    }
  }

  async notifyFollowers(promoterId: string, request: FollowerNotificationRequest): Promise<NotificationResult> {
    try {
      // Get target followers based on request
      let query = supabase
        .from('promoter_followers')
        .select(`
          subscriber_id,
          notification_preferences,
          promoter_subscription_tiers!inner(tier)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      // Filter by specific tiers if requested
      if (request.targetType === 'tier' && request.specificTiers?.length) {
        const { data: tieredFollowers, error: tierError } = await supabase
          .from('promoter_followers')
          .select(`
            subscriber_id,
            notification_preferences,
            promoter_subscription_tiers!inner(tier)
          `)
          .eq('promoter_id', promoterId)
          .eq('follow_status', 'active');

        if (tierError) throw tierError;

        const filteredFollowers = tieredFollowers?.filter(follower => {
          const tierData = follower.promoter_subscription_tiers;
          if (Array.isArray(tierData) && tierData.length > 0) {
            return request.specificTiers?.includes(tierData[0].tier);
          }
          return false;
        });

        return this.sendNotificationsToFollowers(promoterId, request, filteredFollowers || []);
      }

      const { data: followers, error: followersError } = await query;
      if (followersError) throw followersError;

      return this.sendNotificationsToFollowers(promoterId, request, followers || []);
    } catch (error: any) {
      console.error('Error sending follower notifications:', error);
      return {
        success: false,
        sentCount: 0,
        errors: [error.message]
      };
    }
  }

  private async sendNotificationsToFollowers(
    promoterId: string, 
    request: FollowerNotificationRequest, 
    followers: any[]
  ): Promise<NotificationResult> {
    if (!followers.length) {
      return {
        success: true,
        sentCount: 0,
        errors: ['No followers match the target criteria']
      };
    }

    // Filter followers based on notification preferences
    const eligibleFollowers = followers.filter(follower => {
      if (!follower.notification_preferences) return true;
      
      const prefs = follower.notification_preferences as any;
      return (request.includeEmail && prefs.email_notifications !== false) ||
             (request.includePush && prefs.push_notifications !== false);
    });

    let sentCount = 0;
    const errors: string[] = [];

    // Send notifications to eligible followers
    for (const follower of eligibleFollowers) {
      try {
        // Convert notification preferences to JSON safely
        const metadata: Json = {
          promoter_id: promoterId,
          notification_type: 'follower_communication',
          discount_code: request.discountCode || null,
          target_type: request.targetType,
          include_email: request.includeEmail,
          include_push: request.includePush
        };

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: follower.subscriber_id,
            recipient_type: 'individual',
            title: request.title,
            content: request.message,
            priority: request.priority,
            metadata
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

    return {
      success: sentCount > 0,
      sentCount,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  async sendFlyer(promoterId: string, flyerData: any): Promise<boolean> {
    try {
      // Implementation for sending flyers
      console.log('Sending flyer from promoter:', promoterId, flyerData);
      return true;
    } catch (error: any) {
      console.error('Error sending flyer:', error);
      return false;
    }
  }

  async sendDiscountCode(promoterId: string, discountData: any): Promise<boolean> {
    try {
      // Implementation for sending discount codes
      console.log('Sending discount code from promoter:', promoterId, discountData);
      return true;
    } catch (error: any) {
      console.error('Error sending discount code:', error);
      return false;
    }
  }
}

export const promoterNotificationService = new PromoterNotificationServiceClass();
