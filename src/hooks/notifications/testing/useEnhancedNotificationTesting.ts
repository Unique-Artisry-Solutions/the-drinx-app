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

      // Check for Notification API support
      if (!('Notification' in window)) {
        throw new Error('Notification API not supported');
      }

      if (!navigator.serviceWorker?.controller) {
        throw new Error('Service Worker not ready. Please refresh the page.');
      }

      const messageChannel = new MessageChannel();
      const responsePromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Timed out waiting for Service Worker response'));
        }, 5000);
        
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timeoutId);
          if (event.data.success) {
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Failed to show notification'));
          }
        };
      });

      if (config.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, config.delay * 1000));
      }

      const notificationOptions = {
        body: config.content || 'Enhanced test notification',
        icon: '/favicon.ico',
        tag: `test-${config.category}-${Date.now()}`,
        requireInteraction: true,
        silent: !config.animate,
        data: {
          priority: config.priority,
          timestamp: new Date().toISOString(),
          source: 'enhanced-tester'
        }
      };

      navigator.serviceWorker.controller.postMessage({
        action: 'showTestNotification',
        title: config.category,
        options: notificationOptions
      }, [messageChannel.port2]);
      
      await responsePromise;

      if (config.useScreenReader) {
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('role', 'status');
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.textContent = `Notification sent: ${config.content}`;
        document.body.appendChild(ariaLive);
        setTimeout(() => document.body.removeChild(ariaLive), 1000);
      }

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
