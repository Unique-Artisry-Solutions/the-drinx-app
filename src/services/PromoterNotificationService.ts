
import { supabase } from '@/lib/supabase';
import { NotificationPreferences } from '@/types/SubscriptionTypes';

export interface TargetedNotificationRequest {
  title: string;
  content: string;
  targetType: 'all' | 'free_followers' | 'premium_followers' | 'specific_tier';
  tierIds?: string[];
  discountCode?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  expiresAt?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationResult {
  success: boolean;
  notificationsSent: number;
  errors?: string[];
}

// Type guard for NotificationPreferences
function isNotificationPreferences(obj: any): obj is NotificationPreferences {
  return obj && 
         typeof obj === 'object' && 
         typeof obj.events === 'boolean' &&
         typeof obj.promotions === 'boolean' &&
         typeof obj.announcements === 'boolean';
}

// Default notification preferences
const defaultNotificationPreferences: NotificationPreferences = {
  events: true,
  promotions: true,
  announcements: true,
  email_notifications: false,
  push_notifications: false
};

class PromoterNotificationService {
  async sendTargetedNotification(
    promoterId: string, 
    notification: TargetedNotificationRequest
  ): Promise<NotificationResult> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== promoterId) {
      throw new Error('Unauthorized');
    }

    try {
      // Get target followers based on criteria
      const targetFollowers = await this.getTargetFollowers(promoterId, notification);
      
      if (targetFollowers.length === 0) {
        return {
          success: true,
          notificationsSent: 0
        };
      }

      // Create discount code if provided
      let discountCodeId: string | undefined;
      if (notification.discountCode) {
        discountCodeId = await this.createDiscountCode(promoterId, notification);
      }

      // Send notifications to each target follower
      const notificationPromises = targetFollowers.map(async (follower) => {
        // Check if follower wants this type of notification
        const preferences = this.parseNotificationPreferences(follower.notification_preferences);
        
        if (!this.shouldSendNotification(notification, preferences)) {
          return null;
        }

        return this.sendNotificationToFollower(
          follower.subscriber_id,
          promoterId,
          notification,
          discountCodeId
        );
      });

      const results = await Promise.allSettled(notificationPromises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const errors = results
        .filter(r => r.status === 'rejected')
        .map(r => r.status === 'rejected' ? r.reason : '');

      return {
        success: true,
        notificationsSent: successful,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error('Error sending targeted notification:', error);
      return {
        success: false,
        notificationsSent: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private async getTargetFollowers(
    promoterId: string, 
    notification: TargetedNotificationRequest
  ): Promise<any[]> {
    let query = supabase
      .from('promoter_followers')
      .select('subscriber_id, tier_id, notification_preferences')
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    // Apply targeting filters
    switch (notification.targetType) {
      case 'free_followers':
        query = query.is('tier_id', null);
        break;
      case 'premium_followers':
        query = query.not('tier_id', 'is', null);
        break;
      case 'specific_tier':
        if (notification.tierIds && notification.tierIds.length > 0) {
          query = query.in('tier_id', notification.tierIds);
        }
        break;
      // 'all' case - no additional filters
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  private parseNotificationPreferences(preferencesData: any): NotificationPreferences {
    // Safe type conversion with validation
    if (isNotificationPreferences(preferencesData)) {
      return preferencesData;
    }

    return defaultNotificationPreferences;
  }

  private shouldSendNotification(
    notification: TargetedNotificationRequest,
    preferences: NotificationPreferences
  ): boolean {
    // Check if user has opted in for this type of notification
    if (notification.discountCode && !preferences.promotions) {
      return false;
    }

    if (!notification.discountCode && !preferences.announcements) {
      return false;
    }

    return true;
  }

  private async createDiscountCode(
    promoterId: string,
    notification: TargetedNotificationRequest
  ): Promise<string> {
    if (!notification.discountCode || !notification.discountType || !notification.discountValue) {
      throw new Error('Invalid discount code parameters');
    }

    const { data, error } = await supabase
      .from('establishment_promotions')
      .insert({
        establishment_id: promoterId, // Assuming promoter acts as establishment for discounts
        code: notification.discountCode,
        description: `Targeted promotion: ${notification.title}`,
        discount_type: notification.discountType,
        discount_value: notification.discountValue,
        start_date: new Date().toISOString(),
        end_date: notification.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
        is_active: true,
        usage_limit: 1000 // Default limit
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  private async sendNotificationToFollower(
    followerId: string,
    promoterId: string,
    notification: TargetedNotificationRequest,
    discountCodeId?: string
  ): Promise<boolean> {
    const metadata: any = {
      promoter_id: promoterId,
      notification_type: 'targeted_promotion'
    };

    if (discountCodeId) {
      metadata.discount_code_id = discountCodeId;
      metadata.discount_code = notification.discountCode;
    }

    const { error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: followerId,
        recipient_type: 'individual',
        title: notification.title,
        content: notification.content,
        priority: notification.priority || 'medium',
        metadata
      });

    return !error;
  }

  async getPromoterFollowers(promoterId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        subscriber_id,
        tier_id,
        follow_status,
        created_at,
        promoter_subscription_tiers!inner(name, tier)
      `)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    if (error) throw error;
    return data || [];
  }

  async getFollowerStats(promoterId: string): Promise<{
    total: number;
    free: number;
    premium: number;
    byTier: Record<string, number>;
  }> {
    const followers = await this.getPromoterFollowers(promoterId);
    
    const stats = {
      total: followers.length,
      free: followers.filter(f => !f.tier_id).length,
      premium: followers.filter(f => f.tier_id).length,
      byTier: {} as Record<string, number>
    };

    // Count by tier
    followers.forEach(follower => {
      if (follower.tier_id && follower.promoter_subscription_tiers) {
        const tierName = follower.promoter_subscription_tiers.name;
        stats.byTier[tierName] = (stats.byTier[tierName] || 0) + 1;
      }
    });

    return stats;
  }
}

export const promoterNotificationService = new PromoterNotificationService();
