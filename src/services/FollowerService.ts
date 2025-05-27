
import { supabase } from '@/lib/supabase';
import type { NotificationPreferences, Subscription } from '@/types/SubscriptionTypes';

export interface FollowRequest {
  promoterId: string;
  tierId?: string;
}

export interface FollowerNotification {
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Helper function to safely convert Json to NotificationPreferences
function jsonToNotificationPreferences(json: any): NotificationPreferences {
  if (typeof json === 'object' && json !== null) {
    return {
      events: json.events ?? true,
      promotions: json.promotions ?? true,
      announcements: json.announcements ?? true,
      email_notifications: json.email_notifications ?? false,
      push_notifications: json.push_notifications ?? false,
    };
  }
  
  // Default preferences if json is not a valid object
  return {
    events: true,
    promotions: true,
    announcements: true,
    email_notifications: false,
    push_notifications: false,
  };
}

// Helper function to safely convert NotificationPreferences to Json
function notificationPreferencesToJson(preferences: NotificationPreferences): Record<string, boolean> {
  return {
    events: preferences.events,
    promotions: preferences.promotions,
    announcements: preferences.announcements,
    email_notifications: preferences.email_notifications ?? false,
    push_notifications: preferences.push_notifications ?? false,
  };
}

export class FollowerService {
  // Get user's followed promoters/subscriptions
  static async getUserFollows(): Promise<Subscription[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        *,
        promoter_subscription_tiers!left(name, tier, price)
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
      follow_status: item.follow_status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      tier_name: item.promoter_subscription_tiers?.name,
      notification_preferences: jsonToNotificationPreferences(item.notification_preferences)
    }));
  }

  // Get followers for a specific promoter
  static async getPromoterFollowers(promoterId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        *,
        profiles!inner(display_name, username),
        promoter_subscription_tiers!left(name, tier, price)
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
      follow_status: item.follow_status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      tier_name: item.promoter_subscription_tiers?.name,
      notification_preferences: jsonToNotificationPreferences(item.notification_preferences)
    }));
  }

  // Follow a promoter (free)
  static async followPromoter(promoterId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already following
    const { data: existing } = await supabase
      .from('promoter_followers')
      .select('id')
      .eq('subscriber_id', user.id)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active')
      .maybeSingle();

    if (existing) {
      throw new Error('Already following this promoter');
    }

    const { error } = await supabase
      .from('promoter_followers')
      .insert({
        subscriber_id: user.id,
        promoter_id: promoterId,
        tier_id: null, // null for free followers
        follow_status: 'active',
        notification_preferences: notificationPreferencesToJson({
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

    // Check if already subscribed to this tier
    const { data: existing } = await supabase
      .from('promoter_followers')
      .select('id')
      .eq('subscriber_id', user.id)
      .eq('promoter_id', promoterId)
      .eq('tier_id', tierId)
      .eq('follow_status', 'active')
      .maybeSingle();

    if (existing) {
      throw new Error('Already subscribed to this tier');
    }

    // If user is already following for free, upgrade to premium
    const { data: freeFollow } = await supabase
      .from('promoter_followers')
      .select('id')
      .eq('subscriber_id', user.id)
      .eq('promoter_id', promoterId)
      .is('tier_id', null)
      .eq('follow_status', 'active')
      .maybeSingle();

    if (freeFollow) {
      // Upgrade existing free follow to premium
      const { error } = await supabase
        .from('promoter_followers')
        .update({ 
          tier_id: tierId,
          updated_at: new Date().toISOString()
        })
        .eq('id', freeFollow.id);

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
          notification_preferences: notificationPreferencesToJson({
            events: true,
            promotions: true,
            announcements: true,
            email_notifications: true,
            push_notifications: true,
          })
        });

      if (error) throw error;
    }
  }

  // Unfollow/unsubscribe
  static async unfollowPromoter(subscriptionId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('promoter_followers')
      .update({ 
        follow_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .eq('subscriber_id', user.id);

    if (error) throw error;
  }

  // Send notification to followers
  static async sendNotificationToFollowers(
    promoterId: string, 
    notification: FollowerNotification,
    targetTiers?: string[]
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get followers based on target tiers
    let query = supabase
      .from('promoter_followers')
      .select('subscriber_id, notification_preferences')
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    if (targetTiers && targetTiers.length > 0) {
      if (targetTiers.includes('free')) {
        // Include both free followers and specific tiers
        const paidTiers = targetTiers.filter(t => t !== 'free');
        if (paidTiers.length > 0) {
          query = query.or(`tier_id.is.null,tier_id.in.(${paidTiers.join(',')})`);
        } else {
          query = query.is('tier_id', null);
        }
      } else {
        query = query.in('tier_id', targetTiers);
      }
    }

    const { data: followers, error: followersError } = await query;
    if (followersError) throw followersError;

    // Filter followers who have notifications enabled
    const eligibleFollowers = followers.filter(follower => {
      const prefs = jsonToNotificationPreferences(follower.notification_preferences);
      return prefs.announcements;
    });

    // Create notifications for eligible followers
    const notifications = eligibleFollowers.map(follower => ({
      recipient_id: follower.subscriber_id,
      title: notification.title,
      content: notification.content,
      priority: notification.priority || 'medium',
      recipient_type: 'individual'
    }));

    if (notifications.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;
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
      content: `${description}\n\nView flyer: ${flyerUrl}`,
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
    const expiryText = expiresAt ? `\n\nExpires: ${new Date(expiresAt).toLocaleDateString()}` : '';
    
    await this.sendNotificationToFollowers(promoterId, {
      title,
      content: `${description}\n\nDiscount Code: ${discountCode}${expiryText}`,
      priority: 'high'
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
      .update({ 
        notification_preferences: notificationPreferencesToJson(preferences),
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .eq('subscriber_id', user.id);

    if (error) throw error;
  }
}
