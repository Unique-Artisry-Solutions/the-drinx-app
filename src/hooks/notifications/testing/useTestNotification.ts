
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export const useTestNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendTestNotification = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to send test notifications"
      });
      return;
    }

    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      toast({
        variant: "destructive",
        title: "Service Worker Error",
        description: "Service worker not available. Please refresh the page."
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const messageChannel = new MessageChannel();
      const responsePromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 5000);

        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timeout);
          if (event.data.success) {
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Failed to send notification'));
          }
        };
      });

      navigator.serviceWorker.controller.postMessage({
        action: 'showTestNotification',
        title: 'Test Notification',
        options: {
          body: 'This is a test notification',
          icon: '/favicon.ico',
          tag: `test-${Date.now()}`,
          data: {
            userId: user.id,
            timestamp: new Date().toISOString()
          }
        }
      }, [messageChannel.port2]);

      await responsePromise;
      
      toast({
        title: "Success",
        description: "Test notification sent successfully"
      });
    } catch (error) {
      console.error('Test notification error:', error);
      toast({
        variant: "destructive",
        title: "Notification Error",
        description: error instanceof Error ? error.message : 'Failed to send test notification'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendTestNotification
  };
};
