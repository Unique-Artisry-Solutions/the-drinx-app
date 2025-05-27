
import { supabase } from '@/integrations/supabase/client';
import { FollowerNotificationRequest, NotificationResult } from '@/types/FollowerNotificationTypes';

interface NotificationBatch {
  promoterId: string;
  notifications: Array<{
    followerId: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    metadata?: any;
  }>;
  scheduledFor: Date;
}

class PromoterNotificationTriggerServiceClass {
  private batchQueue = new Map<string, NotificationBatch>();
  private readonly BATCH_DELAY_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_NOTIFICATIONS_PER_HOUR = 10;

  async triggerEventUpdate(
    promoterId: string, 
    eventData: {
      id: string;
      title: string;
      description?: string;
      eventType: 'created' | 'updated' | 'cancelled';
    }
  ): Promise<NotificationResult> {
    const title = this.getEventNotificationTitle(eventData.eventType, eventData.title);
    const content = this.getEventNotificationContent(eventData);
    
    return this.scheduleFollowerNotifications(promoterId, {
      title,
      content,
      priority: eventData.eventType === 'cancelled' ? 'high' : 'medium',
      metadata: {
        event_id: eventData.id,
        event_type: eventData.eventType,
        notification_type: 'event_update'
      }
    });
  }

  async triggerPromotion(
    promoterId: string,
    promotionData: {
      id: string;
      title: string;
      discountCode?: string;
      expiresAt?: string;
    }
  ): Promise<NotificationResult> {
    return this.scheduleFollowerNotifications(promoterId, {
      title: 'New Promotion Available!',
      content: `Check out the new promotion: ${promotionData.title}`,
      priority: 'medium',
      metadata: {
        promotion_id: promotionData.id,
        discount_code: promotionData.discountCode,
        expires_at: promotionData.expiresAt,
        notification_type: 'promotion'
      }
    });
  }

  async triggerGeneralUpdate(
    promoterId: string,
    updateData: {
      title: string;
      content: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
    }
  ): Promise<NotificationResult> {
    return this.scheduleFollowerNotifications(promoterId, {
      title: updateData.title,
      content: updateData.content,
      priority: updateData.priority || 'medium',
      metadata: {
        notification_type: 'general_update'
      }
    });
  }

  private async scheduleFollowerNotifications(
    promoterId: string,
    notification: {
      title: string;
      content: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      metadata?: any;
    }
  ): Promise<NotificationResult> {
    try {
      // Check rate limiting
      const canSend = await this.checkRateLimit(promoterId);
      if (!canSend) {
        return {
          success: false,
          sentCount: 0,
          errors: ['Rate limit exceeded. Maximum 10 notifications per hour allowed.']
        };
      }

      // Get active followers
      const { data: followers, error } = await supabase
        .from('promoter_followers')
        .select('subscriber_id, notification_preferences')
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (error) throw error;

      if (!followers || followers.length === 0) {
        return {
          success: true,
          sentCount: 0,
          errors: ['No active followers found']
        };
      }

      // Filter followers based on notification preferences
      const eligibleFollowers = followers.filter(follower => {
        const prefs = follower.notification_preferences as any;
        return !prefs || prefs.events !== false;
      });

      const batchKey = `${promoterId}-${Date.now()}`;
      
      // Check if we should batch or send immediately
      if (notification.priority === 'urgent') {
        // Send urgent notifications immediately
        return this.sendImmediateNotifications(promoterId, eligibleFollowers, notification);
      } else {
        // Add to batch queue
        return this.addToBatch(batchKey, promoterId, eligibleFollowers, notification);
      }
    } catch (error: any) {
      console.error('Error scheduling follower notifications:', error);
      return {
        success: false,
        sentCount: 0,
        errors: [error.message]
      };
    }
  }

  private async sendImmediateNotifications(
    promoterId: string,
    followers: any[],
    notification: any
  ): Promise<NotificationResult> {
    let sentCount = 0;
    const errors: string[] = [];

    for (const follower of followers) {
      try {
        const { error } = await supabase
          .from('notifications')
          .insert({
            recipient_id: follower.subscriber_id,
            recipient_type: 'individual',
            title: notification.title,
            content: notification.content,
            priority: notification.priority,
            metadata: {
              ...notification.metadata,
              promoter_id: promoterId,
              sent_immediately: true
            }
          });

        if (error) {
          errors.push(`Failed to notify follower: ${error.message}`);
        } else {
          sentCount++;
        }
      } catch (err: any) {
        errors.push(`Failed to notify follower: ${err.message}`);
      }
    }

    // Record rate limit usage
    await this.recordNotificationSent(promoterId);

    return {
      success: sentCount > 0,
      sentCount,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async addToBatch(
    batchKey: string,
    promoterId: string,
    followers: any[],
    notification: any
  ): Promise<NotificationResult> {
    const scheduledFor = new Date(Date.now() + this.BATCH_DELAY_MS);
    
    const batch: NotificationBatch = {
      promoterId,
      notifications: followers.map(follower => ({
        followerId: follower.subscriber_id,
        title: notification.title,
        content: notification.content,
        priority: notification.priority,
        metadata: {
          ...notification.metadata,
          promoter_id: promoterId,
          batched: true
        }
      })),
      scheduledFor
    };

    this.batchQueue.set(batchKey, batch);

    // Schedule batch processing
    setTimeout(() => {
      this.processBatch(batchKey);
    }, this.BATCH_DELAY_MS);

    return {
      success: true,
      sentCount: followers.length,
      errors: [`Notifications scheduled for batch delivery at ${scheduledFor.toISOString()}`]
    };
  }

  private async processBatch(batchKey: string) {
    const batch = this.batchQueue.get(batchKey);
    if (!batch) return;

    try {
      const notifications = batch.notifications.map(notif => ({
        recipient_id: notif.followerId,
        recipient_type: 'individual' as const,
        title: notif.title,
        content: notif.content,
        priority: notif.priority,
        metadata: notif.metadata
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Error processing notification batch:', error);
      } else {
        console.log(`Successfully processed batch for promoter ${batch.promoterId}: ${notifications.length} notifications sent`);
        await this.recordNotificationSent(batch.promoterId);
      }
    } catch (error) {
      console.error('Error processing notification batch:', error);
    } finally {
      this.batchQueue.delete(batchKey);
    }
  }

  private async checkRateLimit(promoterId: string): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('notifications')
      .select('id')
      .eq('metadata->>promoter_id', promoterId)
      .gte('created_at', oneHourAgo.toISOString());

    if (error) {
      console.error('Error checking rate limit:', error);
      return true; // Allow on error to not block notifications
    }

    return (data?.length || 0) < this.MAX_NOTIFICATIONS_PER_HOUR;
  }

  private async recordNotificationSent(promoterId: string) {
    // This could be expanded to track in a separate rate limiting table
    console.log(`Notification sent for promoter ${promoterId} at ${new Date().toISOString()}`);
  }

  private getEventNotificationTitle(eventType: string, eventTitle: string): string {
    switch (eventType) {
      case 'created':
        return 'New Event Created!';
      case 'updated':
        return 'Event Updated';
      case 'cancelled':
        return 'Event Cancelled';
      default:
        return 'Event Notification';
    }
  }

  private getEventNotificationContent(eventData: any): string {
    switch (eventData.eventType) {
      case 'created':
        return `A new event "${eventData.title}" has been created. Check it out!`;
      case 'updated':
        return `The event "${eventData.title}" has been updated. See the latest details.`;
      case 'cancelled':
        return `Unfortunately, the event "${eventData.title}" has been cancelled.`;
      default:
        return `Update for event: ${eventData.title}`;
    }
  }
}

export const promoterNotificationTriggerService = new PromoterNotificationTriggerServiceClass();
