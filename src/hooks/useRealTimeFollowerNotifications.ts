
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { realTimeFollowerNotificationService } from '@/services/RealTimeFollowerNotificationService';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import type { FollowerData } from '@/hooks/useFollowers';

interface UseRealTimeFollowerNotificationsProps {
  promoterId?: string;
  enabled?: boolean;
}

// Type guard to safely check if an object is FollowerData
const isFollowerData = (obj: any): obj is FollowerData => {
  return obj && 
         typeof obj === 'object' && 
         'promoter_id' in obj && 
         'follow_status' in obj;
};

export function useRealTimeFollowerNotifications({ 
  promoterId, 
  enabled = true 
}: UseRealTimeFollowerNotificationsProps = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscriptions, refetch } = useSubscriptions(promoterId);
  const isSubscribed = useRef(false);

  // Set up toast for the service
  useEffect(() => {
    realTimeFollowerNotificationService.setToast(toast);
  }, [toast]);

  // Handle incoming notifications
  const handleNotification = useCallback((notification: any) => {
    console.log('Received real-time follower notification:', notification);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.content,
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

  // Subscribe to promoter notifications (for followers)
  useEffect(() => {
    if (!enabled || !user || !promoterId || isSubscribed.current) return;

    // Check if user follows this promoter with proper type checking
    const isFollowing = subscriptions.some((sub: any) => 
      isFollowerData(sub) && 
      sub.promoter_id === promoterId && 
      sub.follow_status === 'active'
    );

    if (isFollowing) {
      realTimeFollowerNotificationService.subscribeToPromoterNotifications(
        promoterId, 
        handleNotification
      );
      isSubscribed.current = true;
    }

    return () => {
      if (isSubscribed.current) {
        realTimeFollowerNotificationService.unsubscribeFromPromoterNotifications(promoterId);
        isSubscribed.current = false;
      }
    };
  }, [enabled, user, promoterId, subscriptions, handleNotification]);

  // Subscribe to follower updates (for promoters)
  useEffect(() => {
    if (!enabled || !user) return;

    const channel = realTimeFollowerNotificationService.subscribeToFollowerUpdates(
      user.id, 
      handleFollowerUpdate
    );

    return () => {
      if (channel) {
        realTimeFollowerNotificationService.unsubscribeFromPromoterNotifications(user.id);
      }
    };
  }, [enabled, user, handleFollowerUpdate]);

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

    return await realTimeFollowerNotificationService.sendRealtimeNotificationToFollowers(
      promoterId,
      {
        ...notificationData,
        priority: notificationData.priority || 'medium'
      }
    );
  }, [promoterId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      realTimeFollowerNotificationService.cleanup();
    };
  }, []);

  return {
    sendRealtimeNotification,
    isConnected: enabled && !!user
  };
}
