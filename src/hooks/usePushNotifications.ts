
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { PushSubscription } from '@/types/NotificationTypes';
import { useServiceWorkerStatus } from './service-worker/useServiceWorkerStatus';
import { useServiceWorkerRegistration } from './notifications/useServiceWorkerRegistration';
import { usePushSubscription } from './notifications/usePushSubscription';

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  
  const { toast } = useToast();
  const { hasServiceWorker, setHasServiceWorker, refreshPermissionStatus } = useServiceWorkerStatus();
  const { registerServiceWorker, unregisterAllServiceWorkers } = useServiceWorkerRegistration();
  const { createPushSubscription, resetSubscription } = usePushSubscription();

  // Check if push notifications are supported in this browser
  const checkPushSupport = useCallback(async (): Promise<boolean> => {
    try {
      const hasServiceWorkerSupport = 'serviceWorker' in navigator;
      const hasPushManagerSupport = 'PushManager' in window;
      const hasNotificationSupport = 'Notification' in window;
      
      const isSupported = hasServiceWorkerSupport && hasPushManagerSupport && hasNotificationSupport;
      console.log('Push notification support check:', { 
        hasServiceWorkerSupport, 
        hasPushManagerSupport,
        hasNotificationSupport,
        isSupported 
      });
      
      return isSupported;
    } catch (err) {
      console.error('Error checking push support:', err);
      return false;
    }
  }, []);

  // Check notification permissions
  const checkPermissions = useCallback(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      console.log('Checking permission status:', currentPermission);
      setPermissionStatus(currentPermission);
      return currentPermission;
    }
    return null;
  }, []);

  // Reset subscription state
  const resetSubscriptionState = useCallback(async () => {
    try {
      setSubscription(null);
      setError(null);
      
      // Reset push subscription
      await resetSubscription();
      
      // Then unregister all service workers
      await unregisterAllServiceWorkers();
      
      return true;
    } catch (error) {
      console.error('Error during subscription reset:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset subscription state');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resetSubscription, unregisterAllServiceWorkers]);

  // Subscribe to push notifications
  const subscribeToNotifications = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check push support
      const isPushSupported = await checkPushSupport();
      if (!isPushSupported) {
        setIsSupported(false);
        throw new Error('Push notifications are not supported in this browser');
      }
      
      setIsSupported(true);
      
      // Check permission
      const currentPermission = checkPermissions();
      console.log('Current permission status:', currentPermission);
      
      if (currentPermission === 'denied') {
        throw new Error('Notification permission denied: Please enable notifications in your browser settings');
      }
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Register service worker
      const registration = await registerServiceWorker();
      setHasServiceWorker(true);
      console.log('Service worker ready:', registration);
      
      // Create push subscription
      const savedSubscription = await createPushSubscription(registration, user.id);
      setSubscription(savedSubscription);
      
      toast({
        title: "Success",
        description: "Successfully subscribed to push notifications!",
      });
    } catch (error: any) {
      console.error('Push Notification Setup Error:', error);
      setError(error.message || "Failed to set up push notifications");
      toast({
        title: "Notification Error",
        description: error.message || "Failed to set up push notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        // Check if push is supported
        const isSupported = await checkPushSupport();
        
        if (!isMounted) return;
        setIsSupported(isSupported);
        
        if (isSupported) {
          // Check current permission
          const permission = checkPermissions();
          if (!permission) return;
          
          // Reset if permission has changed
          if (permission !== permissionStatus) {
            await resetSubscriptionState();
          }
          
          // If we have permission, check for existing subscription
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && permission === 'granted') {
            const { data: subscriptions } = await supabase
              .from('push_notification_subscriptions')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (subscriptions && subscriptions.length > 0) {
              setSubscription(subscriptions[0]);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize push notifications");
          console.error('Error initializing push notifications:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
  }, [checkPermissions, checkPushSupport, permissionStatus, resetSubscriptionState]);
  
  return {
    isSupported,
    subscription,
    permissionStatus,
    isLoading,
    error,
    subscribeToNotifications,
    showPermissionPrompt,
    checkPermissions,
    resetSubscriptionState
  };
}
