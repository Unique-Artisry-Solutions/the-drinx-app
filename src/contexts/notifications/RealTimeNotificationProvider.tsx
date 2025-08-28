// Task 3 & 4: Real-time Notification Provider with advanced features
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useUnifiedNotifications } from '@/hooks/realtime/useUnifiedNotifications';
import { Notification } from '@/types/notification';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { realTimeFollowerNotificationService } from '@/services/RealTimeFollowerNotificationService';
import { useToast } from '@/hooks/use-toast';
import { toastDeduplication } from '@/utils/toastDeduplication';

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
  
  // Deduplication tracking
  const processedNotificationsRef = useRef(new Map<string, { timestamp: number; processed: boolean }>());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Unified notifications hook with dispose method
  const unifiedNotifications = useUnifiedNotifications({
    enableRealTime: true,
    enableQueue: true,
    enablePresence: true
  });

  // Advanced notification features state
  const [groupedNotifications, setGroupedNotifications] = useState<{ [key: string]: Notification[] }>({});
  const [deliveryStatus, setDeliveryStatus] = useState<{ [key: string]: 'pending' | 'delivered' | 'read' | 'failed' }>({});
  const [urgentNotifications, setUrgentNotifications] = useState<Notification[]>([]);
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Idempotent message handling with deduplication
  const createNotificationKey = useCallback((notification: Notification) => {
    return `${notification.id}-${notification.created_at}`;
  }, []);

  const shouldProcessNotification = useCallback((notification: Notification) => {
    const key = createNotificationKey(notification);
    const now = Date.now();
    const existing = processedNotificationsRef.current.get(key);
    
    // If already processed within last 5 minutes, skip it
    if (existing && existing.processed && (now - existing.timestamp) < 300000) {
      console.log('Notification deduplicated:', key);
      return false;
    }
    
    // Mark as processed
    processedNotificationsRef.current.set(key, { timestamp: now, processed: true });
    
    // Clean up old entries (older than 10 minutes)
    processedNotificationsRef.current.forEach((value, k) => {
      if ((now - value.timestamp) > 600000) {
        processedNotificationsRef.current.delete(k);
      }
    });
    
    return true;
  }, [createNotificationKey]);

  // Page visibility tracking for pausing notifications
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      console.log(`Page visibility changed: ${document.hidden ? 'hidden' : 'visible'}`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Notification grouping logic with deduplication
  useEffect(() => {
    if (!enableGrouping) return;

    const grouped = unifiedNotifications.notifications
      .filter(notification => shouldProcessNotification(notification))
      .reduce((acc, notification) => {
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
  }, [unifiedNotifications.notifications, enableGrouping, maxNotificationsPerGroup, shouldProcessNotification]);

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

  // Cross-tab notification synchronization with origin safety and deduplication
  const broadcastNotification = useCallback((notification: Notification) => {
    if (!enableTabSync || !isPageVisible) return;

    // Check for duplicate using toast deduplication
    if (!toastDeduplication.shouldShowToast({
      title: notification.title,
      description: notification.content || '',
      type: notification.priority
    })) {
      return;
    }

    try {
      import('@/utils/serviceWorkerErrorHandler').then(({ safeBroadcastMessage }) => {
        safeBroadcastMessage('notifications', {
          type: 'new_notification',
          notification,
          tabId,
          timestamp: Date.now()
        });
      }).catch(error => {
        console.warn('Failed to broadcast notification:', error);
        // Fallback to BroadcastChannel
        try {
          const channel = new BroadcastChannel('notifications');
          channel.postMessage({
            type: 'new_notification',
            notification,
            tabId,
            timestamp: Date.now()
          });
          channel.close();
        } catch (fallbackError) {
          console.warn('Fallback broadcast also failed:', fallbackError);
        }
      });
    } catch (error) {
      console.warn('Failed to broadcast notification:', error);
    }
  }, [enableTabSync, isPageVisible, tabId]);

  // Listen for cross-tab notifications with origin validation and deduplication
  useEffect(() => {
    if (!enableTabSync) return;

    const broadcastChannel = new BroadcastChannel('notifications');
    
    broadcastChannel.onmessage = (event) => {
      try {
        const { type, notification, tabId: senderTabId, origin, timestamp } = event.data;
        
        // Validate origin if provided
        if (origin && origin !== window.location.origin) {
          console.warn('Cross-tab message from different origin:', { origin, currentOrigin: window.location.origin });
          return;
        }
        
        // Ignore messages from the same tab
        if (senderTabId === tabId) return;
        
        // Ignore old messages (older than 10 seconds)
        if (timestamp && (Date.now() - timestamp) > 10000) {
          console.log('Ignoring old cross-tab message:', { timestamp, age: Date.now() - timestamp });
          return;
        }
        
        if (type === 'new_notification') {
          // Check for duplicates before processing
          if (!shouldProcessNotification(notification)) {
            return;
          }
          
          // Handle notification from another tab only if page is visible
          if (isPageVisible) {
            console.log('Received notification from another tab:', notification);
            
            // Show subtle indicator that notification was received in another tab
            if (toastDeduplication.shouldShowToast({
              title: "Notification received",
              description: "Check other tab for new notification"
            })) {
              toast({
                title: "Notification received",
                description: "Check other tab for new notification",
                duration: 2000
              });
            }
          }
        } else if (type === 'notification_read') {
          // Sync read status across tabs
          setDeliveryStatus(prev => ({
            ...prev,
            [notification.id]: 'read'
          }));
        }
      } catch (error) {
        console.warn('Error processing cross-tab message:', error);
      }
    };

    return () => {
      try {
        broadcastChannel.close();
      } catch (error) {
        console.warn('Error closing broadcast channel:', error);
      }
    };
  }, [enableTabSync, tabId, toast, shouldProcessNotification, isPageVisible]);

  // Enhanced mark as read with delivery tracking
  const markAsRead = async (id: string) => {
    await unifiedNotifications.markAsRead(id);
    
    if (enableDeliveryTracking) {
      setDeliveryStatus(prev => ({
        ...prev,
        [id]: 'read'
      }));
    }

    // Broadcast read status to other tabs with origin safety
    if (enableTabSync) {
      import('@/utils/serviceWorkerErrorHandler').then(({ safeBroadcastMessage }) => {
        safeBroadcastMessage('notifications', {
          type: 'notification_read',
          notification: { id },
          tabId
        });
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

  // Exponential backoff for reconnection
  const exponentialBackoff = useCallback((attempt: number) => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    return delay + (Math.random() * 1000); // Add jitter
  }, []);

  // Set up follower notification service integration with reconnection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const setupService = () => {
      realTimeFollowerNotificationService.setToast(toast);
      
      // Subscribe to promoter notifications if user is a follower
      const handleFollowerNotification = (notification: any) => {
        // Check for duplicates first
        const unifiedNotification: Notification = {
          id: `follower-${Date.now()}`,
          title: notification.title,
          content: notification.content,
          priority: notification.priority,
          created_at: new Date().toISOString(),
          is_read: false,
          metadata: notification.metadata
        };

        if (!shouldProcessNotification(unifiedNotification)) {
          return;
        }

        // Add to state through offline handler if needed
        unifiedNotifications.handleOfflineNotification(unifiedNotification);
        
        // Broadcast to other tabs
        broadcastNotification(unifiedNotification);
      };

      // Setup error handling and reconnection
      const handleConnectionError = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = exponentialBackoff(reconnectAttempts);
          console.log(`Reconnecting follower service in ${delay}ms (attempt ${reconnectAttempts + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts++;
            setupService();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached for follower service');
        }
      };

      return handleConnectionError;
    };

    const handleError = setupService();

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      realTimeFollowerNotificationService.cleanup();
    };
  }, [isAuthenticated, user, toast, shouldProcessNotification, unifiedNotifications.handleOfflineNotification, broadcastNotification, exponentialBackoff]);

  // Notification batching for performance with visibility pause
  useEffect(() => {
    const batchSize = 5;
    const batchDelay = 1000; // 1 second
    
    let notificationBatch: Notification[] = [];
    let batchTimeout: NodeJS.Timeout | null = null;

    const processBatch = () => {
      if (notificationBatch.length === 0 || !isPageVisible) return;

      // Filter out duplicates in batch
      const uniqueNotifications = notificationBatch.filter(notification => 
        shouldProcessNotification(notification)
      );

      if (uniqueNotifications.length === 0) {
        notificationBatch = [];
        return;
      }

      // Process batch of notifications
      console.log(`Processing batch of ${uniqueNotifications.length} notifications`);
      
      // Group notifications by priority
      const urgent = uniqueNotifications.filter(n => n.priority === 'urgent');
      const high = uniqueNotifications.filter(n => n.priority === 'high');
      const medium = uniqueNotifications.filter(n => n.priority === 'medium');
      const low = uniqueNotifications.filter(n => n.priority === 'low');

      // Show summary toast for batched notifications if dedupe allows
      if (uniqueNotifications.length > 1 && toastDeduplication.shouldShowToast({
        title: `${uniqueNotifications.length} new notifications`,
        description: urgent.length > 0 ? `${urgent.length} urgent` : `${high.length} high priority`
      })) {
        toast({
          title: `${uniqueNotifications.length} new notifications`,
          description: urgent.length > 0 ? `${urgent.length} urgent` : `${high.length} high priority`,
          duration: 3000
        });
      }

      notificationBatch = [];
    };

    // Process batch when page becomes visible
    if (isPageVisible && notificationBatch.length > 0) {
      processBatch();
    }

    return () => {
      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }
    };
  }, [toast, isPageVisible, shouldProcessNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Clear processed notifications cache
      processedNotificationsRef.current.clear();
      // Clear toast deduplication
      toastDeduplication.clear();
    };
  }, []);

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