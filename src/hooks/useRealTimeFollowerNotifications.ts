
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useFollowers } from '@/hooks/useFollowers';
import { supabase } from '@/integrations/supabase/client';

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
  const { followers } = useFollowers(promoterId);
  const isSubscribed = useRef(false);

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
  }, [toast]);

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
  }, [toast]);

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

    // For now, just send to all followers via the database
    // Real-time functionality would be implemented with Supabase realtime
    const followerIds = followers.map(f => f.subscriber_id);
    
    for (const followerId of followerIds) {
      await supabase
        .from('notifications')
        .insert({
          recipient_id: followerId,
          recipient_type: 'individual',
          title: notificationData.title,
          content: notificationData.content,
          priority: notificationData.priority || 'medium'
        });
    }

    return { sentCount: followerIds.length, errors: [] };
  }, [promoterId, followers]);

  return {
    sendRealtimeNotification,
    isConnected: enabled && !!user
  };
}
