import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { PushSubscription } from '@/types/NotificationTypes';
import { urlB64ToUint8Array } from '@/hooks/utils/pushUtils';
import { useServiceWorkerStatus } from './service-worker/useServiceWorkerStatus';

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const { toast } = useToast();
  const { hasServiceWorker, setHasServiceWorker, refreshPermissionStatus } = useServiceWorkerStatus();
  const vapidRetryCount = useRef(0);
  const maxVapidRetries = 3;
  
  const resetSubscriptionState = useCallback(async () => {
    setSubscription(null);
    setIsLoading(false);
    setError(null);
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Existing push subscription cleared');
      }
    }
  }, []);

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

  const getVapidPublicKey = async (): Promise<string> => {
    for (let i = 0; i <= maxVapidRetries; i++) {
      try {
        console.log(`Attempting to get VAPID public key (attempt ${i + 1}/${maxVapidRetries + 1})`);
        const { data, error } = await supabase
          .functions.invoke('notifications', {
            body: { action: 'getVapidKey' }
          });
        
        if (error) {
          console.error('VAPID key error:', error);
          throw new Error(`Failed to retrieve VAPID public key: ${error.message || 'Unknown error'}`);
        }
        
        if (!data || !data.publicKey) {
          throw new Error('No public key returned from server');
        }
        
        console.log('Successfully retrieved VAPID public key');
        return data.publicKey;
      } catch (error) {
        console.error(`VAPID key retrieval attempt ${i + 1} failed:`, error);
        vapidRetryCount.current = i + 1;
        
        if (i === maxVapidRetries) {
          throw error;
        }
        
        await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, i), 5000)));
      }
    }
    
    throw new Error('Failed to retrieve VAPID public key after retries');
  };

  const checkServiceWorker = async (): Promise<boolean> => {
    try {
      if (!('serviceWorker' in navigator)) return false;
      
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length === 0) return false;
      
      for (const registration of registrations) {
        if (registration.active && registration.active.scriptURL.includes('service-worker.js')) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking service worker:', error);
      return false;
    }
  };

  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    try {
      return await navigator.serviceWorker.register('/service-worker.js');
    } catch (error) {
      console.error('Failed to register service worker:', error);
      return null;
    }
  };

  const saveSubscription = async (
    pushSubscription: PushSubscriptionJSON, 
    userId: string
  ): Promise<PushSubscription | null> => {
    try {
      const p256dhKey = pushSubscription.keys?.p256dh;
      const authKey = pushSubscription.keys?.auth;
      
      if (!p256dhKey || !authKey) {
        throw new Error('Push subscription is missing required keys');
      }
      
      const subData: PushSubscription = {
        user_id: userId,
        endpoint: pushSubscription.endpoint,
        p256dh: p256dhKey,
        auth: authKey,
        device_info: {
          userAgent: navigator.userAgent,
          language: navigator.language
        }
      };
      
      const { data, error } = await supabase
        .from('push_notification_subscriptions')
        .upsert(subData, { onConflict: 'endpoint' })
        .select();
      
      if (error) throw error;
      
      return data[0] as PushSubscription;
    } catch (error) {
      console.error('Error saving push subscription:', error);
      return null;
    }
  };

  const subscribeToNotifications = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await resetSubscriptionState();
      
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
      
      const hasRegisteredServiceWorker = await checkServiceWorker();
      setHasServiceWorker(hasRegisteredServiceWorker);
      
      const registration = await navigator.serviceWorker.ready;
      console.log('Service worker ready:', registration);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const vapidPublicKey = await getVapidPublicKey();
      const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);
      
      const existingSubscription = await registration.pushManager.getSubscription();
      console.log('Existing subscription:', existingSubscription);
      
      let pushSubscription;
      if (existingSubscription) {
        pushSubscription = existingSubscription;
      } else {
        try {
          pushSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
          });
          console.log('Created new push subscription:', pushSubscription);
        } catch (subscribeError) {
          console.error('Error subscribing to push:', subscribeError);
          if (subscribeError.name === 'NotAllowedError') {
            setPermissionStatus('denied');
            throw new Error('Push subscription permission was denied');
          } else {
            throw subscribeError;
          }
        }
      }
      
      const savedSubscription = await saveSubscription(
        pushSubscription.toJSON(), 
        user.id
      );
      
      if (savedSubscription) {
        setSubscription(savedSubscription);
        toast({
          title: "Success",
          description: "Successfully subscribed to push notifications!",
        });
      } else {
        throw new Error('Failed to save push subscription');
      }
    } catch (error) {
      console.error('Push Notification Setup Error:', error);
      setError(error instanceof Error ? error.message : "Failed to set up push notifications");
      toast({
        title: "Notification Error",
        description: error instanceof Error ? error.message : "Failed to set up push notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
  }, [checkPushSupport, checkPermissions, permissionStatus, resetSubscriptionState]);
  
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
