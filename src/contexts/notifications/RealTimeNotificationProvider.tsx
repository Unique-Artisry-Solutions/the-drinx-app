// Task 3 & 4: Real-time Notification Provider with advanced features
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUnifiedNotifications } from '@/hooks/realtime/useUnifiedNotifications';
import { Notification } from '@/types/notification';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { realTimeFollowerNotificationService } from '@/services/RealTimeFollowerNotificationService';
import { useToast } from '@/hooks/use-toast';

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  connectionState: any;
  queueSize: number;
  isRealTimeEnabled: boolean;
  lastSync: Date | null;
  presenceState: any;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
  reconnect: () => void;
  // Notification grouping
  groupedNotifications: { [key: string]: Notification[] };
  // Delivery tracking
  deliveryStatus: { [key: string]: 'pending' | 'delivered' | 'read' | 'failed' };
  // Priority handling
  urgentNotifications: Notification[];
  // Tab synchronization
  tabId: string;
  broadcastNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface RealTimeNotificationProviderProps {
  children: React.ReactNode;
  enableGrouping?: boolean;
  enableDeliveryTracking?: boolean;
  enableTabSync?: boolean;
  maxNotificationsPerGroup?: number;
}

export const RealTimeNotificationProvider: React.FC<RealTimeNotificationProviderProps> = ({
  children,
  enableGrouping = true,
  enableDeliveryTracking = true,
  enableTabSync = true,
  maxNotificationsPerGroup = 10
}) => {
  const { user, isAuthenticated } = useAuthenticatedUser();
  const { toast } = useToast();
  
  // Generate unique tab ID for synchronization
  const [tabId] = useState(() => `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  // Unified notifications hook
  const unifiedNotifications = useUnifiedNotifications({
    enableRealTime: true,
    enableQueue: true,
    enablePresence: true
  });

  // Advanced notification features state
  const [groupedNotifications, setGroupedNotifications] = useState<{ [key: string]: Notification[] }>({});
  const [deliveryStatus, setDeliveryStatus] = useState<{ [key: string]: 'pending' | 'delivered' | 'read' | 'failed' }>({});
  const [urgentNotifications, setUrgentNotifications] = useState<Notification[]>([]);

  // Notification grouping logic
  useEffect(() => {
    if (!enableGrouping) return;

    const grouped = unifiedNotifications.notifications.reduce((acc, notification) => {
      // Group by notification type from metadata
      const groupKey = notification.metadata?.type || 'general';
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      
      // Limit notifications per group
      if (acc[groupKey].length < maxNotificationsPerGroup) {
        acc[groupKey].push(notification);
      }
      
      return acc;
    }, {} as { [key: string]: Notification[] });

    setGroupedNotifications(grouped);
  }, [unifiedNotifications.notifications, enableGrouping, maxNotificationsPerGroup]);

  // Urgent notifications filtering
  useEffect(() => {
    const urgent = unifiedNotifications.notifications.filter(
      n => n.priority === 'urgent' && !n.is_read
    );
    setUrgentNotifications(urgent);
  }, [unifiedNotifications.notifications]);

  // Delivery status tracking
  useEffect(() => {
    if (!enableDeliveryTracking) return;

    unifiedNotifications.notifications.forEach(notification => {
      if (!deliveryStatus[notification.id]) {
        setDeliveryStatus(prev => ({
          ...prev,
          [notification.id]: notification.is_read ? 'read' : 'delivered'
        }));
      }
    });
  }, [unifiedNotifications.notifications, enableDeliveryTracking, deliveryStatus]);

  // Cross-tab notification synchronization
  const broadcastNotification = (notification: Notification) => {
    if (!enableTabSync) return;

    const broadcastChannel = new BroadcastChannel('notifications');
    broadcastChannel.postMessage({
      type: 'new_notification',
      notification,
      tabId
    });
  };

  // Listen for cross-tab notifications
  useEffect(() => {
    if (!enableTabSync) return;

    const broadcastChannel = new BroadcastChannel('notifications');
    
    broadcastChannel.onmessage = (event) => {
      const { type, notification, tabId: senderTabId } = event.data;
      
      // Ignore messages from the same tab
      if (senderTabId === tabId) return;
      
      if (type === 'new_notification') {
        // Handle notification from another tab
        console.log('Received notification from another tab:', notification);
        
        // Show subtle indicator that notification was received in another tab
        toast({
          title: "Notification received",
          description: "Check other tab for new notification",
          duration: 2000
        });
      } else if (type === 'notification_read') {
        // Sync read status across tabs
        setDeliveryStatus(prev => ({
          ...prev,
          [notification.id]: 'read'
        }));
      }
    };

    return () => {
      broadcastChannel.close();
    };
  }, [enableTabSync, tabId, toast]);

  // Enhanced mark as read with delivery tracking
  const markAsRead = async (id: string) => {
    await unifiedNotifications.markAsRead(id);
    
    if (enableDeliveryTracking) {
      setDeliveryStatus(prev => ({
        ...prev,
        [id]: 'read'
      }));
    }

    // Broadcast read status to other tabs
    if (enableTabSync) {
      const broadcastChannel = new BroadcastChannel('notifications');
      broadcastChannel.postMessage({
        type: 'notification_read',
        notification: { id },
        tabId
      });
    }
  };

  // Enhanced mark all as read
  const markAllAsRead = async () => {
    await unifiedNotifications.markAllAsRead();
    
    if (enableDeliveryTracking) {
      const allIds = unifiedNotifications.notifications.map(n => n.id);
      setDeliveryStatus(prev => {
        const updated = { ...prev };
        allIds.forEach(id => {
          updated[id] = 'read';
        });
        return updated;
      });
    }
  };

  // Set up follower notification service integration
  useEffect(() => {
    if (isAuthenticated && user) {
      realTimeFollowerNotificationService.setToast(toast);
      
      // Subscribe to promoter notifications if user is a follower
      // This integrates with existing follower notification system
      const handleFollowerNotification = (notification: any) => {
        // Convert to unified notification format
        const unifiedNotification: Notification = {
          id: `follower-${Date.now()}`,
          title: notification.title,
          content: notification.content,
          priority: notification.priority,
          created_at: new Date().toISOString(),
          is_read: false,
          metadata: notification.metadata
        };

        // Add to state through offline handler if needed
        unifiedNotifications.handleOfflineNotification(unifiedNotification);
        
        // Broadcast to other tabs
        broadcastNotification(unifiedNotification);
      };

      // This would need to be connected based on user's promoter subscriptions
      // For now, just set up the handler
      return () => {
        realTimeFollowerNotificationService.cleanup();
      };
    }
  }, [isAuthenticated, user, toast, unifiedNotifications.handleOfflineNotification, broadcastNotification]);

  // Notification batching for performance
  useEffect(() => {
    const batchSize = 5;
    const batchDelay = 1000; // 1 second
    
    let notificationBatch: Notification[] = [];
    let batchTimeout: NodeJS.Timeout | null = null;

    const processBatch = () => {
      if (notificationBatch.length === 0) return;

      // Process batch of notifications
      console.log(`Processing batch of ${notificationBatch.length} notifications`);
      
      // Group notifications by priority
      const urgent = notificationBatch.filter(n => n.priority === 'urgent');
      const high = notificationBatch.filter(n => n.priority === 'high');
      const medium = notificationBatch.filter(n => n.priority === 'medium');
      const low = notificationBatch.filter(n => n.priority === 'low');

      // Show summary toast for batched notifications
      if (notificationBatch.length > 1) {
        toast({
          title: `${notificationBatch.length} new notifications`,
          description: urgent.length > 0 ? `${urgent.length} urgent` : `${high.length} high priority`,
          duration: 3000
        });
      }

      notificationBatch = [];
    };

    // This would be triggered by real-time notification events
    // For now, it's set up as a framework for batching

    return () => {
      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }
    };
  }, [toast]);

  const contextValue: NotificationContextType = {
    ...unifiedNotifications,
    markAsRead,
    markAllAsRead,
    groupedNotifications,
    deliveryStatus,
    urgentNotifications,
    tabId,
    broadcastNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useRealTimeNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useRealTimeNotifications must be used within a RealTimeNotificationProvider');
  }
  return context;
};