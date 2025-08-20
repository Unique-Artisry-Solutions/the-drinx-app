// Task 2: Notification Queue System for offline scenarios
import { useCallback, useEffect, useRef, useState } from 'react';
import { Notification } from '@/types/notification';

export interface QueuedNotification extends Notification {
  queuedAt: Date;
  retryCount: number;
  maxRetries: number;
}

interface UseNotificationQueueProps {
  isOnline: boolean;
  onProcessQueue?: (notifications: QueuedNotification[]) => Promise<void>;
  maxQueueSize?: number;
  retryDelay?: number;
}

export const useNotificationQueue = ({
  isOnline,
  onProcessQueue,
  maxQueueSize = 100,
  retryDelay = 5000
}: UseNotificationQueueProps) => {
  const [queue, setQueue] = useState<QueuedNotification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add notification to queue
  const enqueue = useCallback((notification: Notification, maxRetries = 3) => {
    const queuedNotification: QueuedNotification = {
      ...notification,
      queuedAt: new Date(),
      retryCount: 0,
      maxRetries
    };

    setQueue(prev => {
      // Remove oldest if queue is full
      const newQueue = prev.length >= maxQueueSize 
        ? prev.slice(1) 
        : prev;
      
      return [...newQueue, queuedNotification];
    });
  }, [maxQueueSize]);

  // Remove notification from queue
  const dequeue = useCallback((notificationId: string) => {
    setQueue(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Clear entire queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Get queue statistics
  const getQueueStats = useCallback(() => {
    return {
      size: queue.length,
      oldestQueued: queue.length > 0 ? queue[0].queuedAt : null,
      failedCount: queue.filter(n => n.retryCount >= n.maxRetries).length,
      pendingCount: queue.filter(n => n.retryCount < n.maxRetries).length
    };
  }, [queue]);

  // Process queue when online
  const processQueue = useCallback(async () => {
    if (!isOnline || isProcessing || queue.length === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      // Get notifications ready for processing (not exceeded max retries)
      const pendingNotifications = queue.filter(n => n.retryCount < n.maxRetries);
      
      if (pendingNotifications.length === 0) {
        setIsProcessing(false);
        return;
      }

      console.log(`Processing ${pendingNotifications.length} queued notifications`);

      // Process notifications
      if (onProcessQueue) {
        await onProcessQueue(pendingNotifications);
        
        // Remove successfully processed notifications
        setQueue(prev => 
          prev.filter(n => !pendingNotifications.find(p => p.id === n.id))
        );
      } else {
        // Default behavior: just clear the queue
        clearQueue();
      }

    } catch (error) {
      console.error('Error processing notification queue:', error);
      
      // Get the notifications that failed for retry count increment
      const failedNotifications = pendingNotifications;
      
      // Increment retry count for failed notifications
      setQueue(prev => prev.map(n => {
        const failed = failedNotifications.find(f => f.id === n.id);
        if (failed) {
          return { ...n, retryCount: n.retryCount + 1 };
        }
        return n;
      }));

      // Schedule retry for notifications that haven't exceeded max retries
      const retryableNotifications = queue.filter(n => n.retryCount < n.maxRetries - 1);
      if (retryableNotifications.length > 0) {
        processingTimeoutRef.current = setTimeout(() => {
          processQueue();
        }, retryDelay);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isOnline, isProcessing, queue, onProcessQueue, retryDelay, clearQueue]);

  // Auto-process queue when coming online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      // Small delay to allow connection to stabilize
      const timeout = setTimeout(() => {
        processQueue();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isOnline, queue.length, processQueue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  // Persist queue to localStorage for reliability
  useEffect(() => {
    const persistQueue = () => {
      try {
        localStorage.setItem('notification_queue', JSON.stringify(queue));
      } catch (error) {
        console.warn('Failed to persist notification queue:', error);
      }
    };

    // Debounce the persistence to avoid excessive writes
    const timeout = setTimeout(persistQueue, 500);
    return () => clearTimeout(timeout);
  }, [queue]);

  // Load queue from localStorage on initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notification_queue');
      if (stored) {
        const parsedQueue = JSON.parse(stored);
        // Validate and restore dates
        const restoredQueue = parsedQueue.map((n: any) => ({
          ...n,
          queuedAt: new Date(n.queuedAt),
          created_at: new Date(n.created_at),
          updated_at: new Date(n.updated_at)
        }));
        setQueue(restoredQueue);
      }
    } catch (error) {
      console.warn('Failed to restore notification queue:', error);
    }
  }, []);

  return {
    queue,
    queueSize: queue.length,
    isProcessing,
    enqueue,
    dequeue,
    clearQueue,
    processQueue,
    getQueueStats
  };
};