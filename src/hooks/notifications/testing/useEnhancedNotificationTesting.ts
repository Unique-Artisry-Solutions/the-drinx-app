
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationEvents } from './useNotificationEvents';
import { useEnvironmentInfo } from './useEnvironmentInfo';

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

  const sendEnhancedTestNotification = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        throw new Error('Notification API not supported');
      }

      console.log('[NotificationTesting] Creating enhanced test notification...');
      
      // Add delay if specified
      if (config.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, config.delay * 1000));
      }

      const notification = new Notification(config.category, {
        body: config.content || 'Test notification content',
        icon: '/favicon.ico',
        tag: `test-${config.category}-${Date.now()}`,
        requireInteraction: true,
        silent: !config.animate
      });

      // Set up event handlers
      notification.onshow = onShow;
      notification.onclick = () => onClick(notification);
      notification.onerror = onError;
      notification.onclose = onClose;

      // Log for screen readers if enabled
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

      setTimeout(logEnvironmentInfo, 500);
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
