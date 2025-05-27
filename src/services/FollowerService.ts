
import { supabase } from '@/lib/supabase';
import type { Subscription, SubscriptionTier, NotificationPreferences } from '@/types/SubscriptionTypes';

export interface FollowRequest {
  promoterId: string;
  tierId?: string;
}

export interface FollowerNotification {
  title: string;
  content: string;
  type: 'event' | 'promotion' | 'announcement' | 'flyer' | 'discount';
  metadata?: {
    eventId?: string;
    discountCode?: string;
    flyerUrl?: string;
    expiresAt?: string;
  };
}

export class FollowerService {
  // Follow a promoter (free)
  static async followPromoter(promoterId: string): Promise<Subscription> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('promoter_followers')
      .insert({
        subscriber_id: user.id,
        promoter_id: promoterId,
        follow_status: 'active',
        notification_preferences: {
          events: true,
          promotions: true,
          announcements: true,
          email_notifications: true,
          push_notifications: false
        }
      })
      .select('*')
      .single();

    if (error) throw error;
    return this.mapToSubscription(data);
  }

  // Subscribe to a premium tier
  static async subscribeToTier(promoterId: string, tierId: string): Promise<Subscription> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('promoter_followers')
      .insert({
        subscriber_id: user.id,
        promoter_id: promoterId,
        tier_id: tierId,
        follow_status: 'active',
        notification_preferences: {
          events: true,
          promotions: true,
          announcements: true,
          email_notifications: true,
          push_notifications: true
        }
      })
      .select('*')
      .single();

    if (error) throw error;
    return this.mapToSubscription(data);
  }

  // Unfollow/unsubscribe
  static async unfollowPromoter(subscriptionId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('promoter_followers')
      .update({ 
        follow_status: 'cancelled',
        subscription_end: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .eq('subscriber_id', user.id);

    if (error) throw error;
  }

  // Get user's followed promoters
  static async getUserFollows(userId?: string): Promise<Subscription[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        *,
        promoter:profiles!promoter_followers_promoter_id_fkey(display_name),
        tier:promoter_subscription_tiers(name, tier, features)
      `)
      .eq('subscriber_id', targetUserId)
      .eq('follow_status', 'active');

    if (error) throw error;
    return data.map(this.mapToSubscription);
  }

  // Get promoter's followers
  static async getPromoterFollowers(promoterId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        *,
        subscriber:profiles!promoter_followers_subscriber_id_fkey(display_name, avatar_url),
        tier:promoter_subscription_tiers(name, tier, features)
      `)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    if (error) throw error;
    return data.map(this.mapToSubscription);
  }

  // Send notification to followers
  static async sendNotificationToFollowers(
    promoterId: string, 
    notification: FollowerNotification,
    targetTiers?: string[]
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get followers based on tier targeting
    let query = supabase
      .from('promoter_followers')
      .select('subscriber_id, tier_id, notification_preferences')
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    if (targetTiers && targetTiers.length > 0) {
      query = query.in('tier_id', targetTiers);
    }

    const { data: followers, error: followersError } = await query;
    if (followersError) throw followersError;

    // Create notifications for each follower
    const notifications = followers
      .filter(follower => {
        const prefs = follower.notification_preferences as NotificationPreferences;
        switch (notification.type) {
          case 'event':
            return prefs.events;
          case 'promotion':
          case 'discount':
            return prefs.promotions;
          case 'announcement':
          case 'flyer':
            return prefs.announcements;
          default:
            return true;
        }
      })
      .map(follower => ({
        recipient_id: follower.subscriber_id,
        recipient_type: 'individual',
        title: notification.title,
        content: notification.content,
        priority: 'medium' as const,
        metadata: {
          ...notification.metadata,
          promoter_id: promoterId,
          notification_type: notification.type
        }
      }));

    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) throw notificationError;
    }
  }

  // Send flyer to followers
  static async sendFlyerToFollowers(
    promoterId: string,
    flyerUrl: string,
    title: string,
    description: string,
    targetTiers?: string[]
  ): Promise<void> {
    await this.sendNotificationToFollowers(promoterId, {
      title,
      content: description,
      type: 'flyer',
      metadata: {
        flyerUrl
      }
    }, targetTiers);
  }

  // Send discount code to followers
  static async sendDiscountCodeToFollowers(
    promoterId: string,
    discountCode: string,
    title: string,
    description: string,
    expiresAt?: string,
    targetTiers?: string[]
  ): Promise<void> {
    await this.sendNotificationToFollowers(promoterId, {
      title,
      content: description,
      type: 'discount',
      metadata: {
        discountCode,
        expiresAt
      }
    }, targetTiers);
  }

  // Update notification preferences
  static async updateNotificationPreferences(
    subscriptionId: string,
    preferences: NotificationPreferences
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('promoter_followers')
      .update({ notification_preferences: preferences })
      .eq('id', subscriptionId)
      .eq('subscriber_id', user.id);

    if (error) throw error;
  }

  // Map database record to Subscription type
  private static mapToSubscription(data: any): Subscription {
    return {
      id: data.id,
      subscriber_id: data.subscriber_id,
      promoter_id: data.promoter_id,
      tier_id: data.tier_id,
      subscription_start: data.subscription_start,
      subscription_end: data.subscription_end,
      status: data.tier_id ? 'active' : 'active',
      follow_status: data.follow_status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      promoter_name: data.promoter?.display_name,
      tier_name: data.tier?.name,
      notification_preferences: data.notification_preferences
    };
  }
}
