// Task 3: Unified Real-time Hook System combining all notification functionality
import { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeConnection } from './useRealtimeConnection';
import { useNotificationQueue } from './useNotificationQueue';
import { useUserPresence } from './useUserPresence';
import { toastDeduplication } from '@/utils/toastDeduplication';

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  connectionState: any;
  queueSize: number;
  isRealTimeEnabled: boolean;
  dispose: () => void;
}

interface UseUnifiedNotificationsProps {
  enableRealTime?: boolean;
  enableQueue?: boolean;
  enablePresence?: boolean;
  pollingInterval?: number;
  maxRetries?: number;
}

export const useUnifiedNotifications = ({
  enableRealTime = true,
  enableQueue = true,
  enablePresence = true,
  pollingInterval = 60000, // 1 minute fallback polling
  maxRetries = 3
}: UseUnifiedNotificationsProps = {}) => {
  const { user, isAuthenticated } = useAuthenticatedUser();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(enableRealTime);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processedNotificationsRef = useRef(new Map<string, { timestamp: number; processed: boolean }>());
  const subscriptionsRef = useRef<Array<() => void>>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time connection management
  const {
    connectionState,
    isConnected,
    sendMessage,
    reconnect
  } = useRealtimeConnection({
    channelName: `notifications-${user?.id || 'anonymous'}`,
    onStatusChange: (state) => {
      setIsRealTimeEnabled(state.status === 'connected');
      
      // Show connection status toast for significant changes
      if (state.status === 'connected' && state.retryCount > 0) {
        toast({
          title: "Real-time Connected",
          description: "Live notifications restored",
          duration: 3000
        });
      } else if (state.status === 'error' && state.retryCount > 2) {
        toast({
          title: "Connection Issues",
          description: "Falling back to periodic updates",
          variant: "destructive"
        });
      }
    },
    onMessage: (payload) => {
      handleRealtimeNotification(payload);
    }
  });

  // Notification queue for offline scenarios
  const {
    queueSize,
    enqueue,
    processQueue
  } = useNotificationQueue({
    isOnline: isConnected,
    onProcessQueue: async (queuedNotifications) => {
      console.log('Processing queued notifications:', queuedNotifications.length);
      
      // Add queued notifications to current state
      queuedNotifications.forEach(notification => {
        const key = createNotificationKey(notification);
        if (!processedNotificationsRef.current.has(key)) {
          addNotificationToState(notification);
          processedNotificationsRef.current.set(key, { timestamp: Date.now(), processed: true });
        }
      });
    }
  });

  // User presence tracking
  const { presenceState } = useUserPresence({
    channelName: `notifications-${user?.id || 'anonymous'}`
  });

  // Idempotent notification deduplication
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

  // Handle real-time notification with deduplication
  const handleRealtimeNotification = useCallback((payload: any) => {
    try {
      const notification = payload.payload as Notification;
      
      // Apply deduplication
      if (!shouldProcessNotification(notification)) {
        return;
      }

      console.log('Received real-time notification:', notification);
      
      addNotificationToState(notification);

      // Show toast for high-priority notifications only if page is visible and dedupe allows
      if ((notification.priority === 'urgent' || notification.priority === 'high') && isPageVisible) {
        if (toastDeduplication.shouldShowToast({
          title: notification.title,
          description: notification.content || '',
          type: notification.priority
        })) {
          toast({
            title: notification.title,
            description: notification.content,
            duration: notification.priority === 'urgent' ? 0 : 5000,
            variant: notification.priority === 'urgent' ? 'destructive' : 'default'
          });
        }
      }

    } catch (error) {
      console.error('Error handling real-time notification:', error);
    }
  }, [toast, shouldProcessNotification, isPageVisible]);

  // Page visibility tracking for pausing notifications
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasVisible = isPageVisible;
      const nowVisible = !document.hidden;
      setIsPageVisible(nowVisible);
      
      console.log(`Page visibility changed: ${nowVisible ? 'visible' : 'hidden'}`);
      
      // If page becomes visible after being hidden, refresh notifications
      if (!wasVisible && nowVisible && isAuthenticated) {
        console.log('Page became visible, refreshing notifications');
        fetchNotifications(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPageVisible, isAuthenticated]);

  // Add notification to state with deduplication
  const addNotificationToState = useCallback((notification: Notification) => {
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.find(n => n.id === notification.id);
      if (exists) return prev;

      // Add new notification at the beginning
      const updated = [notification, ...prev];
      
      // Keep only the most recent 100 notifications to prevent memory issues
      return updated.slice(0, 100);
    });

    // Update unread count if notification is unread
    if (!notification.is_read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Fetch notifications from database
  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      const notifications = data as Notification[];
      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.is_read).length);
      setLastSync(new Date());

      // Update processed map to avoid duplicates
      notifications.forEach(n => {
        const key = createNotificationKey(n);
        processedNotificationsRef.current.set(key, { timestamp: Date.now(), processed: true });
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Error fetching notifications:', error);
      
      toast({
        title: "Error Loading Notifications",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, toast]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);

      toast({
        title: "All notifications marked as read",
        duration: 2000
      });

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Set up real-time subscription for database changes with exponential backoff
  useEffect(() => {
    if (!isAuthenticated || !user || !enableRealTime) return;

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const exponentialBackoff = (attempt: number) => {
      const baseDelay = 1000; // 1 second
      const maxDelay = 30000; // 30 seconds
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      return delay + (Math.random() * 1000); // Add jitter
    };

    const setupSubscription = () => {
      try {
        const channel = supabase
          .channel(`notifications-db-${user.id}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${user.id}`
          }, (payload) => {
            const notification = payload.new as Notification;
            handleRealtimeNotification({ payload: notification });
          })
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${user.id}`
          }, (payload) => {
            const notification = payload.new as Notification;
            
            // Update existing notification in state
            setNotifications(prev => 
              prev.map(n => n.id === notification.id ? notification : n)
            );
          })
          .subscribe();

        // Add cleanup function to subscriptions
        const cleanup = () => supabase.removeChannel(channel);
        subscriptionsRef.current.push(cleanup);

        return cleanup;
      } catch (error) {
        console.error('Error setting up subscription:', error);
        
        // If subscription failed, attempt reconnection with backoff
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = exponentialBackoff(reconnectAttempts);
          console.log(`Retrying subscription in ${delay}ms (attempt ${reconnectAttempts + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts++;
            setupSubscription();
          }, delay);
        } else {
          console.error('Max subscription attempts reached');
        }
        return null;
      }
    };

    const cleanup = setupSubscription();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (cleanup) cleanup();
    };
  }, [isAuthenticated, user, enableRealTime, handleRealtimeNotification]);

  // Set up polling fallback when real-time is not available
  useEffect(() => {
    if (!isAuthenticated || isRealTimeEnabled) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    console.log('Setting up polling fallback');
    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications(false);
    }, pollingInterval);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, isRealTimeEnabled, pollingInterval, fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  // Handle offline notifications with deduplication
  const handleOfflineNotification = useCallback((notification: Notification) => {
    if (enableQueue && shouldProcessNotification(notification)) {
      enqueue(notification);
    }
  }, [enableQueue, enqueue, shouldProcessNotification]);

  // Process queued notifications when coming online
  useEffect(() => {
    if (isConnected && queueSize > 0) {
      processQueue();
    }
  }, [isConnected, queueSize, processQueue]);

  // Centralized dispose method for cleanup
  const dispose = useCallback(() => {
    console.log('Disposing unified notifications...');
    
    // Clear all timeouts
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Clean up all subscriptions
    subscriptionsRef.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Error during subscription cleanup:', error);
      }
    });
    subscriptionsRef.current = [];

    // Clear processed notifications cache
    processedNotificationsRef.current.clear();
    
    // Clear toast deduplication
    toastDeduplication.clear();

    // Reset state
    setNotifications([]);
    setUnreadCount(0);
    setError(null);
    setLastSync(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return dispose;
  }, [dispose]);

  const state: NotificationState = {
    notifications,
    unreadCount,
    isLoading,
    error,
    lastSync,
    connectionState,
    queueSize,
    isRealTimeEnabled,
    dispose
  };

  return {
    ...state,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
    reconnect,
    handleOfflineNotification,
    presenceState,
    shouldProcessNotification,
    createNotificationKey
  };
};
