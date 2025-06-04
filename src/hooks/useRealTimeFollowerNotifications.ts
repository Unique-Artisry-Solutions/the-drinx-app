
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { NotificationService } from '@/services/NotificationService';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface UseRealTimeFollowerNotificationsProps {
  promoterId?: string;
  enabled?: boolean;
}

export function useRealTimeFollowerNotifications({ 
  promoterId, 
  enabled = true 
}: UseRealTimeFollowerNotificationsProps = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscriptions, refetch } = useSubscriptions(promoterId);
  const isSubscribed = useRef(false);

  // Handle incoming notifications
  const handleNotification = useCallback((notification: any) => {
    console.log('Received real-time follower notification:', notification);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.content || notification.message,
      duration: notification.priority === 'urgent' ? 0 : 5000,
      variant: notification.priority === 'urgent' ? 'destructive' : 'default'
    });

    // Optionally refetch follower data to update UI
    if (refetch) {
      refetch();
    }
  }, [toast, refetch]);

  // Handle follower updates
  const handleFollowerUpdate = useCallback((update: any) => {
    console.log('Follower update received:', update);
    
    if (update.eventType === 'INSERT') {
      toast({
        title: 'New Follower',
        description: 'Someone new started following you!',
        variant: 'default'
      });
    } else if (update.eventType === 'UPDATE') {
      const oldRecord = update.old;
      const newRecord = update.new;
      
      if (oldRecord.follow_status !== newRecord.follow_status) {
        if (newRecord.follow_status === 'cancelled') {
          toast({
            title: 'Follower Update',
            description: 'A follower has unfollowed you.',
            variant: 'destructive'
          });
        } else if (newRecord.follow_status === 'active') {
          toast({
            title: 'Follower Reactivated',
            description: 'A follower has reactivated their subscription!',
            variant: 'default'
          });
        }
      }
    }
    
    // Refetch data to update UI
    if (refetch) {
      refetch();
    }
  }, [toast, refetch]);

  // Subscribe to notifications using NotificationService
  useEffect(() => {
    if (!enabled || !user) return;

    const unsubscribe = NotificationService.subscribe((notifications) => {
      const relevantNotifications = notifications.filter(n => 
        !n.read && 
        n.metadata?.promoter_id === promoterId
      );
      
      relevantNotifications.forEach(handleNotification);
    });

    return unsubscribe;
  }, [enabled, user, promoterId, handleNotification]);

  // Send real-time notification to followers
  const sendRealtimeNotification = useCallback(async (notificationData: {
    notification_type: 'event_update' | 'promotion' | 'general_update';
    title: string;
    content: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    metadata?: Record<string, any>;
  }) => {
    if (!promoterId) {
      throw new Error('Promoter ID is required to send notifications');
    }

    // Add notification using NotificationService
    NotificationService.addNotification({
      title: notificationData.title,
      message: notificationData.content,
      type: notificationData.priority === 'urgent' ? 'error' : 'info',
      metadata: {
        ...notificationData.metadata,
        promoter_id: promoterId,
        notification_type: notificationData.notification_type
      }
    });

    return { success: true };
  }, [promoterId]);

  return {
    sendRealtimeNotification,
    isConnected: enabled && !!user
  };
}
