
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
      console.log('[NotificationTesting] Starting notification test process');

      // Check for Notification API support
      if (!('Notification' in window)) {
        throw new Error('Notification API not supported');
      }

      // Check Service Worker controller
      if (!navigator.serviceWorker?.controller) {
        console.log('[NotificationTesting] Service Worker not ready, checking status...');
        
        // Try to get service worker registration
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('[NotificationTesting] Found service worker registrations:', registrations.length);
        
        if (registrations.length === 0) {
          throw new Error('Service Worker not installed. Please refresh the page and try again.');
        } else {
          throw new Error('Service Worker installed but not controlling the page. Please wait a moment and try again.');
        }
      }

      console.log('[NotificationTesting] Creating message channel for communication');
      // Create message channel for two-way communication
      const messageChannel = new MessageChannel();
      
      // Set up response handler
      const responsePromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Timed out waiting for Service Worker response'));
        }, 5000);
        
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timeoutId);
          console.log('[NotificationTesting] Received response from Service Worker:', event.data);
          
          if (event.data.success) {
            onShow();
            if (user) {
              logEnvironmentInfo();
            }
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Failed to show notification'));
          }
        };
      });

      // Add delay if specified
      if (config.delay > 0) {
        console.log(`[NotificationTesting] Waiting for ${config.delay}s delay`);
        await new Promise(resolve => setTimeout(resolve, config.delay * 1000));
      }

      // Prepare notification options
      const notificationOptions = {
        body: config.content || 'Test notification content',
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
      
      console.log('[NotificationTesting] Sending request to Service Worker with options:', notificationOptions);

      // Send message to service worker
      navigator.serviceWorker.controller.postMessage({
        action: 'showTestNotification',
        title: config.category,
        options: notificationOptions
      }, [messageChannel.port2]);
      
      // Wait for response
      await responsePromise;

      // Handle screen reader announcement if enabled
      if (config.useScreenReader) {
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('role', 'status');
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.textContent = `Notification sent: ${config.content}`;
        document.body.appendChild(ariaLive);
        setTimeout(() => document.body.removeChild(ariaLive), 1000);
      }

      // Show success toast
      toast({
        title: "Test Notification Sent",
        description: `Category: ${config.category}, Priority: ${config.priority}`
      });

      return { success: true };

    } catch (err) {
      console.error('[EnhancedNotificationTesting] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send test notification');
      
      // Try diagnosing the issue
      try {
        const diagResponse = await diagnoseSWIssue();
        console.log('[NotificationTesting] Diagnostic result:', diagResponse);
      } catch (diagErr) {
        console.error('[NotificationTesting] Diagnostic error:', diagErr);
      }
      
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

  // Helper function to diagnose service worker issues
  const diagnoseSWIssue = async () => {
    if (!navigator.serviceWorker) return { supported: false };
    
    try {
      // Check registrations
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      // Check controller
      const hasController = !!navigator.serviceWorker.controller;
      
      // Check permission
      const permission = Notification.permission;
      
      return {
        supported: true,
        registrations: registrations.length,
        active: registrations.some(r => !!r.active),
        controller: hasController,
        permission
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
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
