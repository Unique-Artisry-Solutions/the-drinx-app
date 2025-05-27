
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface FollowerNotificationData {
  promoter_id: string;
  notification_type: 'event_update' | 'promotion' | 'general_update';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

class RealTimeFollowerNotificationServiceClass {
  private channels: Map<string, RealtimeChannel> = new Map();
  private toast: any = null;

  setToast(toast: any) {
    this.toast = toast;
  }

  // Subscribe to promoter notification events
  subscribeToPromoterNotifications(promoterId: string, onNotification: (notification: FollowerNotificationData) => void) {
    const channelName = `promoter-notifications-${promoterId}`;
    
    // Unsubscribe from existing channel if it exists
    this.unsubscribeFromPromoterNotifications(promoterId);

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'follower_notification' }, ({ payload }) => {
        onNotification(payload as FollowerNotificationData);
        
        if (this.toast) {
          this.toast({
            title: payload.title,
            description: payload.content,
            duration: payload.priority === 'urgent' ? 0 : 5000,
            variant: payload.priority === 'urgent' ? 'destructive' : 'default'
          });
        }
      })
      .subscribe();

    this.channels.set(promoterId, channel);
    return channel;
  }

  // Unsubscribe from promoter notifications
  unsubscribeFromPromoterNotifications(promoterId: string) {
    const channel = this.channels.get(promoterId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(promoterId);
    }
  }

  // Send real-time notification to all followers of a promoter
  async sendRealtimeNotificationToFollowers(
    promoterId: string, 
    notificationData: Omit<FollowerNotificationData, 'promoter_id'>
  ) {
    try {
      const channelName = `promoter-notifications-${promoterId}`;
      const channel = supabase.channel(channelName);
      
      await channel.send({
        type: 'broadcast',
        event: 'follower_notification',
        payload: {
          ...notificationData,
          promoter_id: promoterId,
          timestamp: new Date().toISOString()
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending real-time notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Subscribe to follower system updates for notifications
  subscribeToFollowerUpdates(userId: string, onUpdate: (update: any) => void) {
    const channelName = `follower-updates-${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'promoter_followers',
        filter: `subscriber_id=eq.${userId}`
      }, (payload) => {
        onUpdate(payload);
      })
      .subscribe();

    this.channels.set(`follower-updates-${userId}`, channel);
    return channel;
  }

  // Clean up all subscriptions
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const realTimeFollowerNotificationService = new RealTimeFollowerNotificationServiceClass();
