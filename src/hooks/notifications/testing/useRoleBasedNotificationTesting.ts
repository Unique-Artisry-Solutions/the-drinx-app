
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationEvents } from './useNotificationEvents';
import { useEnvironmentInfo } from './useEnvironmentInfo';

export type NotificationRole = 'user-to-promoter' | 'promoter-to-user' | 'user-to-establishment' | 'establishment-to-user';

export interface RoleBasedNotificationConfig {
  role: NotificationRole;
  senderId: string;
  receiverId: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  metadata?: Record<string, any>;
}

export function useRoleBasedNotificationTesting() {
  const [config, setConfig] = useState<RoleBasedNotificationConfig>({
    role: 'user-to-promoter',
    senderId: '',
    receiverId: '',
    content: '',
    priority: 'medium',
    category: 'default'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { onShow, onClick, onError, onClose } = useNotificationEvents();
  const { logEnvironmentInfo } = useEnvironmentInfo();

  const sendRoleBasedNotification = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        throw new Error('Notification API not supported');
      }

      console.log(`[RoleNotificationTesting] Creating ${config.role} test notification...`);
      
      const notification = new Notification(config.category, {
        body: config.content || 'Test notification content',
        icon: '/favicon.ico',
        tag: `test-${config.role}-${Date.now()}`,
        requireInteraction: true,
        data: {
          role: config.role,
          senderId: config.senderId,
          receiverId: config.receiverId,
          metadata: config.metadata
        }
      });

      // Set up event handlers
      notification.onshow = onShow;
      notification.onclick = () => onClick(notification);
      notification.onerror = onError;
      notification.onclose = onClose;

      toast({
        title: "Role-based Test Notification Sent",
        description: `Type: ${config.role}, Category: ${config.category}`
      });

      logEnvironmentInfo();
      return { success: true };

    } catch (err) {
      console.error('[RoleBasedNotificationTesting] Error:', err);
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
    sendRoleBasedNotification
  };
}
