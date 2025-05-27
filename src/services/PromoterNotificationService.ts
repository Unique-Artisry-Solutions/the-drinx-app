
import { supabase } from '@/lib/supabase';
import { NotificationPreferences } from '@/types/SubscriptionTypes';

export interface FollowerSegment {
  id: string;
  name: string;
  description: string;
  followerCount: number;
  criteria: any;
}

export interface FollowerNotificationRequest {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetSegments?: string[];
  scheduledFor?: string;
  locationBased?: boolean;
  coordinates?: { latitude: number; longitude: number };
  targetRadius?: number;
}

class PromoterNotificationService {
  async getFollowerSegments(promoterId: string): Promise<FollowerSegment[]> {
    try {
      // Get all followers for the promoter
      const { data: followers, error: followersError } = await supabase
        .from('promoter_followers')
        .select('subscriber_id, tier_id, follow_status, notification_preferences')
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (followersError) throw followersError;

      const segments: FollowerSegment[] = [
        {
          id: 'all_followers',
          name: 'All Followers',
          description: 'All active followers',
          followerCount: followers?.length || 0,
          criteria: { type: 'all' }
        }
      ];

      // Group by tier if there are tiers
      const tierGroups = new Map();
      followers?.forEach(follower => {
        if (follower.tier_id) {
          if (!tierGroups.has(follower.tier_id)) {
            tierGroups.set(follower.tier_id, []);
          }
          tierGroups.get(follower.tier_id).push(follower);
        }
      });

      // Add tier-based segments
      for (const [tierId, tierFollowers] of tierGroups) {
        segments.push({
          id: `tier_${tierId}`,
          name: `Tier ${tierId} Subscribers`,
          description: `Followers with tier subscription`,
          followerCount: tierFollowers.length,
          criteria: { type: 'tier', tierId }
        });
      }

      // Add free followers segment
      const freeFollowers = followers?.filter(f => !f.tier_id) || [];
      if (freeFollowers.length > 0) {
        segments.push({
          id: 'free_followers',
          name: 'Free Followers',
          description: 'Followers without paid subscription',
          followerCount: freeFollowers.length,
          criteria: { type: 'free' }
        });
      }

      return segments;
    } catch (error) {
      console.error('Error getting follower segments:', error);
      return [];
    }
  }

  async notifyFollowers(
    promoterId: string, 
    request: FollowerNotificationRequest
  ): Promise<void> {
    try {
      // Get target followers based on segments
      let targetFollowers = await this.getTargetFollowers(promoterId, request.targetSegments);

      // Filter by notification preferences
      targetFollowers = await this.filterByPreferences(targetFollowers, {
        title: request.title,
        content: request.content,
        priority: request.priority
      });

      // Send notifications to each follower
      for (const follower of targetFollowers) {
        await this.sendNotificationToUser(follower.subscriber_id, {
          title: request.title,
          content: request.content,
          priority: request.priority,
          metadata: {
            promoter_id: promoterId,
            notification_type: 'follower_update',
            location_based: request.locationBased || false,
            coordinates: request.coordinates || null,
            target_radius: request.targetRadius || null
          }
        });
      }
    } catch (error) {
      console.error('Error notifying followers:', error);
      throw error;
    }
  }

  private async getTargetFollowers(promoterId: string, segmentIds?: string[]) {
    let query = supabase
      .from('promoter_followers')
      .select('subscriber_id, tier_id, notification_preferences')
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active');

    // Apply segment filters
    if (segmentIds && segmentIds.length > 0) {
      const includesFreeFollowers = segmentIds.includes('free_followers');
      const tierSegments = segmentIds
        .filter(id => id.startsWith('tier_'))
        .map(id => id.replace('tier_', ''));

      if (includesFreeFollowers && tierSegments.length > 0) {
        // Include both free followers and specific tiers
        query = query.or(`tier_id.is.null,tier_id.in.(${tierSegments.join(',')})`);
      } else if (includesFreeFollowers) {
        // Only free followers
        query = query.is('tier_id', null);
      } else if (tierSegments.length > 0) {
        // Only specific tiers
        query = query.in('tier_id', tierSegments);
      }
      // If 'all_followers' is included, no additional filter needed
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  private async filterByPreferences(followers: any[], notification: any) {
    return followers.filter(follower => {
      // Parse notification preferences safely
      const preferences = this.parseNotificationPreferences(follower.notification_preferences);
      
      // Check if user wants to receive this type of notification
      return preferences.events === true || preferences.promotions === true || preferences.announcements === true;
    });
  }

  private parseNotificationPreferences(preferencesData: any): NotificationPreferences {
    const defaultPreferences: NotificationPreferences = {
      events: true,
      promotions: true,
      announcements: true,
      email_notifications: false,
      push_notifications: false
    };

    if (!preferencesData) {
      return defaultPreferences;
    }

    // Handle different data types
    let preferences: any = {};
    
    if (typeof preferencesData === 'string') {
      try {
        preferences = JSON.parse(preferencesData);
      } catch {
        return defaultPreferences;
      }
    } else if (typeof preferencesData === 'object' && preferencesData !== null) {
      preferences = preferencesData;
    } else {
      return defaultPreferences;
    }

    return {
      events: preferences.events ?? defaultPreferences.events,
      promotions: preferences.promotions ?? defaultPreferences.promotions,
      announcements: preferences.announcements ?? defaultPreferences.announcements,
      email_notifications: preferences.email_notifications ?? defaultPreferences.email_notifications,
      push_notifications: preferences.push_notifications ?? defaultPreferences.push_notifications
    };
  }

  private async sendNotificationToUser(userId: string, notification: any) {
    try {
      // Convert to JSON-compatible format
      const notificationData = {
        recipient_id: userId,
        recipient_type: 'individual',
        title: notification.title,
        content: notification.content,
        priority: notification.priority,
        metadata: notification.metadata || {}
      };

      const { error } = await supabase
        .from('notifications')
        .insert([notificationData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending notification to user:', error);
      throw error;
    }
  }

  async sendTargetedNotification(
    promoterId: string,
    segmentId: string,
    notification: {
      title: string;
      content: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
    }
  ): Promise<void> {
    // Use the new notifyFollowers method
    await this.notifyFollowers(promoterId, {
      ...notification,
      targetSegments: [segmentId]
    });
  }

  async getPromoterNotificationStats(promoterId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, created_at, priority, is_read')
        .eq('metadata->>promoter_id', promoterId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const total = data?.length || 0;
      const read = data?.filter(n => n.is_read).length || 0;
      const unread = total - read;

      return {
        total_sent: total,
        total_read: read,
        total_unread: unread,
        read_rate: total > 0 ? (read / total) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return {
        total_sent: 0,
        total_read: 0,
        total_unread: 0,
        read_rate: 0
      };
    }
  }
}

export const promoterNotificationService = new PromoterNotificationService();
export type { FollowerSegment, FollowerNotificationRequest };
