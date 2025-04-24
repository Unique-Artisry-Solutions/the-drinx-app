
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationEvents } from './useNotificationEvents';
import { useEnvironmentInfo } from './useEnvironmentInfo';
import { useAuth } from '@/contexts/auth';

export interface TestNotificationConfig {
  category: string;
  content: string;
  delay: number;
  animate: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  useScreenReader: boolean;
}

export function useEnhancedNotificationTesting() {
  const [config, setConfig] = useState<TestNotificationConfig>({
    category: 'default',
    content: '',
    delay: 0,
    animate: true,
    priority: 'medium',
    useScreenReader: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { onShow, onClick, onError, onClose } = useNotificationEvents();
  const { logEnvironmentInfo } = useEnvironmentInfo();
  const { user } = useAuth();

  const sendEnhancedTestNotification = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        throw new Error('Notification API not supported');
      }

      if (!navigator.serviceWorker?.controller) {
        throw new Error('Service Worker not ready. Please wait a moment and try again.');
      }

      console.log('[NotificationTesting] Sending test notification via Service Worker...');

      // Create message channel for two-way communication
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        const response = event.data;
        console.log('[NotificationTesting] Received response from Service Worker:', response);
        
        if (response.success) {
          onShow();
          if (user) {
            logEnvironmentInfo();
          }
        } else {
          throw new Error(response.error || 'Failed to show notification');
        }
      };

      // Add delay if specified
      if (config.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, config.delay * 1000));
      }

      // Send message to service worker
      navigator.serviceWorker.controller.postMessage({
        action: 'showTestNotification',
        title: config.category,
        options: {
          body: config.content || 'Test notification content',
          icon: '/favicon.ico',
          tag: `test-${config.category}-${Date.now()}`,
          requireInteraction: true,
          silent: !config.animate,
          data: {
            priority: config.priority,
            timestamp: new Date().toISOString()
          }
        }
      }, [messageChannel.port2]);

      toast({
        title: "Test Notification Sent",
        description: `Category: ${config.category}, Priority: ${config.priority}`
      });

      return { success: true };

    } catch (err) {
      console.error('[EnhancedNotificationTesting] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send test notification');
      toast({
        variant: "destructive",
        title: "Notification Error",
        description: err instanceof Error ? err.message : 'Failed to send test notification'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    setConfig,
    isLoading,
    error,
    sendEnhancedTestNotification
  };
}
