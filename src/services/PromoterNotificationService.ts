
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface FollowerNotificationRequest {
  targetType: 'all' | 'free' | 'premium' | 'specific_tiers';
  specificTiers?: string[];
  title: string;
  message: string;
  discountCode?: string;
  priority: 'low' | 'medium' | 'high';
  includeEmail?: boolean;
  includePush?: boolean;
}

export interface NotificationPreferences {
  events: boolean;
  promotions: boolean;
  announcements: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
}

export interface FollowerSegment {
  id: string;
  name: string;
  count: number;
  type: 'free' | 'premium' | 'tier';
  tierDetails?: {
    tierId: string;
    tierName: string;
  };
}

export interface FollowerStats {
  total: number;
  active: number;
  free: number;
  premium: number;
  tiers: {
    tierId: string;
    tierName: string;
    count: number;
  }[];
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
    notification: FollowerNotificationRequest
  ): Promise<{ success: boolean; sentCount: number; errors: string[] }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get followers based on target type
      let followersQuery = supabase
        .from('promoter_followers')
        .select(`
          subscriber_id,
          tier_id,
          notification_preferences,
          promoter_subscription_tiers(name, tier)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      // Filter based on target type
      if (notification.targetType === 'premium') {
        followersQuery = followersQuery.not('tier_id', 'is', null);
      } else if (notification.targetType === 'free') {
        followersQuery = followersQuery.is('tier_id', null);
      } else if (notification.targetType === 'specific_tiers' && notification.specificTiers) {
        followersQuery = followersQuery.in('tier_id', notification.specificTiers);
      }

      const { data: followers, error } = await followersQuery;
      if (error) throw error;

      if (!followers || followers.length === 0) {
        return { success: true, sentCount: 0, errors: [] };
      }

      let sentCount = 0;
      const errors: string[] = [];

      // Create notifications for each follower
      for (const follower of followers) {
        try {
          // Check notification preferences
          const preferences = isNotificationPreferences(follower.notification_preferences) 
            ? follower.notification_preferences 
            : defaultNotificationPreferences;

          if (!preferences.events && notification.title.toLowerCase().includes('event')) {
            continue;
          }
          if (!preferences.promotions && notification.discountCode) {
            continue;
          }

          // Create in-app notification
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              recipient_id: follower.subscriber_id,
              title: notification.title,
              content: notification.message,
              priority: notification.priority,
              metadata: {
                type: 'promoter_notification',
                promoter_id: promoterId,
                discount_code: notification.discountCode,
                target_type: notification.targetType
              }
            });

          if (notificationError) {
            errors.push(`Failed to send to ${follower.subscriber_id}: ${notificationError.message}`);
          } else {
            sentCount++;
          }

          // TODO: Implement email and push notifications based on preferences
          
        } catch (err: any) {
          errors.push(`Error processing follower ${follower.subscriber_id}: ${err.message}`);
        }
      }

      return { success: errors.length === 0, sentCount, errors };
    } catch (error: any) {
      return { success: false, sentCount: 0, errors: [error.message] };
    }
  }

  // Alias for backward compatibility
  async notifyFollowers(
    promoterId: string, 
    notification: FollowerNotificationRequest
  ): Promise<{ success: boolean; sentCount: number; errors: string[] }> {
    return this.sendTargetedNotification(promoterId, notification);
  }

  async getFollowerStats(promoterId: string): Promise<FollowerStats> {
    const { data: followers, error } = await supabase
      .from('promoter_followers')
      .select(`
        tier_id,
        follow_status,
        promoter_subscription_tiers(name, tier)
      `)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    if (error) throw error;

    if (!followers) {
      return {
        total: 0,
        active: 0,
        free: 0,
        premium: 0,
        tiers: []
      };
    }

    const total = followers.length;
    const active = followers.filter(f => f.follow_status === 'active').length;
    const free = followers.filter(f => !f.tier_id).length;
    const premium = followers.filter(f => f.tier_id).length;

    // Group by tiers
    const tierCounts = new Map<string, { name: string; count: number }>();
    followers.forEach(follower => {
      if (follower.tier_id && follower.promoter_subscription_tiers) {
        const tier = follower.promoter_subscription_tiers as any;
        const existing = tierCounts.get(follower.tier_id) || { name: tier.name, count: 0 };
        tierCounts.set(follower.tier_id, { ...existing, count: existing.count + 1 });
      }
    });

    const tiers = Array.from(tierCounts.entries()).map(([tierId, data]) => ({
      tierId,
      tierName: data.name,
      count: data.count
    }));

    return { total, active, free, premium, tiers };
  }

  async getFollowerSegments(promoterId: string): Promise<FollowerSegment[]> {
    const stats = await this.getFollowerStats(promoterId);
    
    const segments: FollowerSegment[] = [
      {
        id: 'all',
        name: 'All Followers',
        count: stats.total,
        type: 'free'
      },
      {
        id: 'free',
        name: 'Free Followers',
        count: stats.free,
        type: 'free'
      },
      {
        id: 'premium',
        name: 'Premium Followers',
        count: stats.premium,
        type: 'premium'
      }
    ];

    // Add tier-specific segments
    stats.tiers.forEach(tier => {
      segments.push({
        id: tier.tierId,
        name: tier.tierName,
        count: tier.count,
        type: 'tier',
        tierDetails: {
          tierId: tier.tierId,
          tierName: tier.tierName
        }
      });
    });

    return segments;
  }

  async updateNotificationPreferences(
    promoterId: string, 
    subscriberId: string, 
    preferences: NotificationPreferences
  ): Promise<void> {
    const { error } = await supabase
      .from('promoter_followers')
      .update({ notification_preferences: preferences })
      .eq('promoter_id', promoterId)
      .eq('subscriber_id', subscriberId);

    if (error) throw error;
  }

  async getNotificationHistory(promoterId: string, limit: number = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('metadata->>promoter_id', promoterId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

export const promoterNotificationService = new PromoterNotificationService();
