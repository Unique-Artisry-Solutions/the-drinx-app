
import { supabase } from '@/lib/supabase';
import type { Subscription, NotificationPreferences } from '@/types/SubscriptionTypes';

export interface FollowRequest {
  promoterId: string;
  tierId?: string;
}

export interface FollowerNotification {
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Helper functions to safely convert between NotificationPreferences and Json
const convertToNotificationPreferences = (data: any): NotificationPreferences => {
  if (data && typeof data === 'object') {
    return {
      events: data.events ?? true,
      promotions: data.promotions ?? true,
      announcements: data.announcements ?? true,
      email_notifications: data.email_notifications ?? false,
      push_notifications: data.push_notifications ?? false,
    };
  }
  return {
    events: true,
    promotions: true,
    announcements: true,
    email_notifications: false,
    push_notifications: false,
  };
};

const convertFromNotificationPreferences = (prefs: NotificationPreferences): Record<string, any> => {
  return {
    events: prefs.events,
    promotions: prefs.promotions,
    announcements: prefs.announcements,
    email_notifications: prefs.email_notifications,
    push_notifications: prefs.push_notifications,
  };
};

export class FollowerService {
  // Get user's followed promoters
  static async getUserFollows(): Promise<Subscription[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        id,
        subscriber_id,
        promoter_id,
        tier_id,
        subscription_start,
        subscription_end,
        follow_status,
        created_at,
        updated_at,
        notification_preferences,
        promoter_subscription_tiers!inner(name)
      `)
      .eq('subscriber_id', user.id)
      .eq('follow_status', 'active');

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      subscriber_id: item.subscriber_id,
      promoter_id: item.promoter_id,
      tier_id: item.tier_id,
      subscription_start: item.subscription_start,
      subscription_end: item.subscription_end,
      status: 'active' as const,
      follow_status: item.follow_status as 'active' | 'paused' | 'cancelled' | 'pending',
      created_at: item.created_at,
      updated_at: item.updated_at,
      tier_name: item.promoter_subscription_tiers?.name,
      notification_preferences: convertToNotificationPreferences(item.notification_preferences)
    }));
  }

  // Get followers for a specific promoter
  static async getPromoterFollowers(promoterId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        id,
        subscriber_id,
        promoter_id,
        tier_id,
        subscription_start,
        subscription_end,
        follow_status,
        created_at,
        updated_at,
        notification_preferences,
        promoter_subscription_tiers(name)
      `)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      subscriber_id: item.subscriber_id,
      promoter_id: item.promoter_id,
      tier_id: item.tier_id,
      subscription_start: item.subscription_start,
      subscription_end: item.subscription_end,
      status: 'active' as const,
      follow_status: item.follow_status as 'active' | 'paused' | 'cancelled' | 'pending',
      created_at: item.created_at,
      updated_at: item.updated_at,
      tier_name: item.promoter_subscription_tiers?.name,
      notification_preferences: convertToNotificationPreferences(item.notification_preferences)
    }));
  }

  // Follow a promoter (free)
  static async followPromoter(promoterId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('promoter_followers')
      .insert({
        subscriber_id: user.id,
        promoter_id: promoterId,
        follow_status: 'active',
        notification_preferences: convertFromNotificationPreferences({
          events: true,
          promotions: true,
          announcements: true,
          email_notifications: false,
          push_notifications: false,
        })
      });

    if (error) throw error;
  }

  // Subscribe to a premium tier
  static async subscribeToTier(promoterId: string, tierId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First check if user is already following
    const { data: existing } = await supabase
      .from('promoter_followers')
      .select('id')
      .eq('subscriber_id', user.id)
      .eq('promoter_id', promoterId)
      .single();

    if (existing) {
      // Update existing follow to premium tier
      const { error } = await supabase
        .from('promoter_followers')
        .update({ tier_id: tierId })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new premium subscription
      const { error } = await supabase
        .from('promoter_followers')
        .insert({
          subscriber_id: user.id,
          promoter_id: promoterId,
          tier_id: tierId,
          follow_status: 'active',
          notification_preferences: convertFromNotificationPreferences({
            events: true,
            promotions: true,
            announcements: true,
            email_notifications: false,
            push_notifications: false,
          })
        });

      if (error) throw error;
    }
  }

  // Unfollow/unsubscribe
  static async unfollowPromoter(subscriptionId: string): Promise<void> {
    const { error } = await supabase
      .from('promoter_followers')
      .update({ follow_status: 'cancelled' })
      .eq('id', subscriptionId);

    if (error) throw error;
  }

  // Send notification to followers
  static async sendNotificationToFollowers(
    promoterId: string, 
    notification: FollowerNotification, 
    targetTiers?: string[]
  ): Promise<void> {
    // Get followers based on target tiers
    let query = supabase
      .from('promoter_followers')
      .select('subscriber_id, notification_preferences')
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
        const prefs = convertToNotificationPreferences(follower.notification_preferences);
        return prefs.announcements; // Check if they want announcements
      })
      .map(follower => ({
        recipient_id: follower.subscriber_id,
        title: notification.title,
        content: notification.content,
        priority: notification.priority || 'medium',
        recipient_type: 'individual'
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
      content: `${description}\n\nView Flyer: ${flyerUrl}`,
      priority: 'medium'
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
    const content = `${description}\n\nDiscount Code: ${discountCode}${expiresAt ? `\nExpires: ${new Date(expiresAt).toLocaleDateString()}` : ''}`;
    
    await this.sendNotificationToFollowers(promoterId, {
      title,
      content,
      priority: 'high'
    }, targetTiers);
  }

  // Update notification preferences
  static async updateNotificationPreferences(
    subscriptionId: string, 
    preferences: NotificationPreferences
  ): Promise<void> {
    const { error } = await supabase
      .from('promoter_followers')
      .update({ 
        notification_preferences: convertFromNotificationPreferences(preferences) 
      })
      .eq('id', subscriptionId);

    if (error) throw error;
  }
}
