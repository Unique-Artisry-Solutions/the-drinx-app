
import { supabase } from '@/lib/supabase';
import type { NotificationPreferences } from '@/types/SubscriptionTypes';

export interface FollowerNotificationRequest {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: {
    followerType?: 'all' | 'free' | 'premium';
    tierIds?: string[];
    specificFollowerIds?: string[];
  };
  eventId?: string;
  discountCode?: string;
  scheduledFor?: string;
}

export interface NotificationResult {
  success: boolean;
  notificationsSent: number;
  failedNotifications: number;
  errors?: string[];
}

class PromoterNotificationService {
  async notifyFollowers(
    promoterId: string, 
    notification: FollowerNotificationRequest
  ): Promise<NotificationResult> {
    try {
      // Get eligible followers based on targeting criteria
      const eligibleFollowers = await this.getEligibleFollowers(
        promoterId, 
        notification.targetAudience
      );

      if (eligibleFollowers.length === 0) {
        return {
          success: true,
          notificationsSent: 0,
          failedNotifications: 0
        };
      }

      // Create notifications for each eligible follower
      const notifications = eligibleFollowers.map(follower => ({
        recipient_id: follower.subscriber_id,
        recipient_type: 'individual',
        title: notification.title,
        content: notification.content,
        priority: notification.priority,
        category_id: null, // Will be set based on notification type
        metadata: {
          promoter_id: promoterId,
          event_id: notification.eventId,
          discount_code: notification.discountCode,
          follower_tier: follower.tier_id,
          notification_type: 'promoter_announcement'
        }
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;

      // If discount code is included, create targeted discount entries
      if (notification.discountCode && notification.eventId) {
        await this.createTargetedDiscounts(
          notification.eventId,
          notification.discountCode,
          eligibleFollowers.map(f => f.subscriber_id)
        );
      }

      return {
        success: true,
        notificationsSent: data.length,
        failedNotifications: 0
      };

    } catch (error: any) {
      console.error('Error sending follower notifications:', error);
      return {
        success: false,
        notificationsSent: 0,
        failedNotifications: 1,
        errors: [error.message]
      };
    }
  }

  async sendEventAnnouncement(
    promoterId: string,
    eventId: string,
    customMessage?: string
  ): Promise<NotificationResult> {
    try {
      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('name, date, time, description')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        throw new Error('Event not found');
      }

      const notification: FollowerNotificationRequest = {
        title: `New Event: ${event.name}`,
        content: customMessage || `Join us for ${event.name} on ${event.date} at ${event.time}. ${event.description || ''}`,
        priority: 'medium',
        targetAudience: { followerType: 'all' },
        eventId
      };

      return await this.notifyFollowers(promoterId, notification);

    } catch (error: any) {
      console.error('Error sending event announcement:', error);
      return {
        success: false,
        notificationsSent: 0,
        failedNotifications: 1,
        errors: [error.message]
      };
    }
  }

  async sendTargetedDiscount(
    promoterId: string,
    eventId: string,
    discountCode: string,
    targetAudience: FollowerNotificationRequest['targetAudience'],
    message?: string
  ): Promise<NotificationResult> {
    const notification: FollowerNotificationRequest = {
      title: 'Exclusive Discount Code!',
      content: message || `You've received an exclusive discount code: ${discountCode}`,
      priority: 'high',
      targetAudience,
      eventId,
      discountCode
    };

    return await this.notifyFollowers(promoterId, notification);
  }

  private async getEligibleFollowers(
    promoterId: string, 
    targetAudience: FollowerNotificationRequest['targetAudience']
  ) {
    let query = supabase
      .from('promoter_followers')
      .select(`
        subscriber_id,
        tier_id,
        follow_status,
        notification_preferences
      `)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    // Apply targeting filters
    if (targetAudience.specificFollowerIds?.length) {
      query = query.in('subscriber_id', targetAudience.specificFollowerIds);
    } else {
      // Filter by follower type
      if (targetAudience.followerType === 'free') {
        query = query.is('tier_id', null);
      } else if (targetAudience.followerType === 'premium') {
        query = query.not('tier_id', 'is', null);
      }

      // Filter by specific tiers
      if (targetAudience.tierIds?.length) {
        query = query.in('tier_id', targetAudience.tierIds);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Filter by notification preferences
    return (data || []).filter(follower => {
      const prefs = follower.notification_preferences as NotificationPreferences;
      return prefs?.events !== false && prefs?.promotions !== false;
    });
  }

  private async createTargetedDiscounts(
    eventId: string,
    discountCode: string,
    followerIds: string[]
  ) {
    // Create individual discount redemption tracking
    const redemptions = followerIds.map(userId => ({
      discount_code_id: discountCode, // This would reference the actual discount code ID
      user_id: userId,
      redemption_date: new Date().toISOString(),
      order_value: 0,
      discount_value: 0,
      metadata: {
        targeted: true,
        event_id: eventId
      }
    }));

    // Note: This would need the actual discount code ID from event_discount_codes table
    // For now, we'll just log the intent
    console.log('Targeted discount tracking created for:', followerIds.length, 'followers');
  }

  async getFollowerSegments(promoterId: string) {
    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        tier_id,
        promoter_subscription_tiers(name, tier)
      `)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    if (error) throw error;

    const segments = {
      total: data.length,
      free: data.filter(f => !f.tier_id).length,
      premium: data.filter(f => f.tier_id).length,
      tiers: {} as Record<string, { name: string; count: number }>
    };

    // Group by tiers
    data.forEach(follower => {
      if (follower.tier_id && follower.promoter_subscription_tiers) {
        const tier = follower.promoter_subscription_tiers as any;
        if (!segments.tiers[follower.tier_id]) {
          segments.tiers[follower.tier_id] = {
            name: tier.name,
            count: 0
          };
        }
        segments.tiers[follower.tier_id].count++;
      }
    });

    return segments;
  }
}

export const promoterNotificationService = new PromoterNotificationService();
