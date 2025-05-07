
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { PushSubscription, DbPushSubscription } from '@/types/notification/PushNotificationTypes';
import { useServiceWorkerStatus } from './service-worker/useServiceWorkerStatus';
import { useServiceWorkerRegistration } from './notifications/useServiceWorkerRegistration';
import { usePushSubscription } from './notifications/usePushSubscription';

// Avoid name conflict with browser's Notification API
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

  const checkPermissions = useCallback(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      console.log('Checking permission status:', currentPermission);
      setPermissionStatus(currentPermission);
      return currentPermission;
    }
    return null;
  }, []);

  const resetSubscriptionState = useCallback(async (): Promise<void> => {
    try {
      setSubscription(null);
      setError(null);
      
      await resetSubscription();
      
      await unregisterAllServiceWorkers();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error during subscription reset:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset subscription state');
      setIsLoading(false);
    }
  }, [resetSubscription, unregisterAllServiceWorkers]);

  const subscribeToNotifications = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const isPushSupported = await checkPushSupport();
      if (!isPushSupported) {
        setIsSupported(false);
        throw new Error('Push notifications are not supported in this browser');
      }
      
      setIsSupported(true);
      
      const currentPermission = checkPermissions();
      console.log('Current permission status:', currentPermission);
      
      if (currentPermission === 'denied') {
        throw new Error('Notification permission denied: Please enable notifications in your browser settings');
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const registration = await registerServiceWorker();
      setHasServiceWorker(true);
      console.log('Service worker ready:', registration);
      
      const savedSubscription = await createPushSubscription(registration, user.id);
      
      if (savedSubscription) {
        setSubscription(savedSubscription);
      }
      
      toast({
        title: "Success",
        description: "Successfully subscribed to push notifications!",
      });
    } catch (error: any) {
      console.error('Push Notification Setup Error:', error);
      
      const errorMessage = error.message || "Failed to set up push notifications";
      setError(errorMessage);
      
      toast({
        title: "Notification Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [checkPermissions, checkPushSupport, createPushSubscription, registerServiceWorker, setHasServiceWorker, toast]);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        const isSupported = await checkPushSupport();
        
        if (!isMounted) return;
        setIsSupported(isSupported);
        
        if (isSupported) {
          const permission = checkPermissions();
          if (!permission) return;
          
          if (permission !== permissionStatus) {
            await resetSubscriptionState();
          }
          
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && permission === 'granted') {
            const { data: subscriptions } = await supabase
              .from('push_notification_subscriptions')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (subscriptions && subscriptions.length > 0) {
              const dbSubscription = subscriptions[0] as DbPushSubscription;
              
              let userAgent: string | undefined;
              let platform: string | undefined;
              let language: string | undefined;
              
              if (dbSubscription.device_info && typeof dbSubscription.device_info === 'object') {
                if (!Array.isArray(dbSubscription.device_info)) {
                  userAgent = dbSubscription.device_info.userAgent;
                  platform = dbSubscription.device_info.platform;
                  language = dbSubscription.device_info.language;
                }
              }
              
              const transformedSubscription: PushSubscription = {
                id: dbSubscription.id,
                endpoint: dbSubscription.endpoint,
                p256dh: dbSubscription.p256dh,
                auth: dbSubscription.auth,
                user_id: dbSubscription.user_id,
                device_info: { 
                  userAgent, 
                  platform,
                  language
                },
                created_at: dbSubscription.created_at,
                updated_at: dbSubscription.updated_at
              };
              
              setSubscription(transformedSubscription);
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
