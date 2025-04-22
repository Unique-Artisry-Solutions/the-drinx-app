
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { PushSubscription } from '@/types/NotificationTypes';

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Convert ArrayBuffer to Base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer) as unknown as number[]));
  };
  
  // Check if service worker is registered and active
  const checkServiceWorker = async (): Promise<boolean> => {
    try {
      if (!('serviceWorker' in navigator)) return false;
      
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length === 0) return false;
      
      // Look for our specific service worker
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
  
  // Register service worker
  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    try {
      return await navigator.serviceWorker.register('/service-worker.js');
    } catch (error) {
      console.error('Failed to register service worker:', error);
      return null;
    }
  };
  
  // Save subscription to database
  const saveSubscription = async (
    pushSubscription: PushSubscriptionJSON, 
    userId: string
  ): Promise<PushSubscription | null> => {
    try {
      // Get the keys from the subscription
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
  
  // Subscribe to push notifications
  const subscribeToNotifications = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if service worker is supported
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsSupported(false);
        throw new Error('Push notifications are not supported in this browser');
      }
      
      setIsSupported(true);
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
      
      // Check if service worker is registered
      const hasServiceWorker = await checkServiceWorker();
      
      // Register service worker if not already registered
      const registration = hasServiceWorker 
        ? await navigator.serviceWorker.ready 
        : await registerServiceWorker();
      
      if (!registration) {
        throw new Error('Failed to register service worker');
      }
      
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch VAPID public key
      const { data, error: keyError } = await supabase
        .functions.invoke('notifications', {
          body: { action: 'getVapidKey' }
        });
      
      if (keyError || !data || !data.publicKey) {
        console.error('VAPID key error:', keyError || 'No public key returned');
        throw new Error('Failed to retrieve VAPID public key');
      }
      
      // Convert base64 string to Uint8Array for applicationServerKey
      const vapidPublicKey = urlB64ToUint8Array(data.publicKey);
      
      // Subscribe to push notifications
      const existingSubscription = await registration.pushManager.getSubscription();
      
      // Use existing subscription or create a new one
      const pushSubscription = existingSubscription || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });
      
      // Save subscription to database
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
  
  // Initialize push notifications
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        // Check if service worker is supported
        const isSupported = 'serviceWorker' in navigator && 
                           'PushManager' in window &&
                           'Notification' in window;
        
        if (!isMounted) return;
        setIsSupported(isSupported);
        
        if (isSupported) {
          // Get current permission status
          const permission = Notification.permission;
          setPermissionStatus(permission);
          
          // Check if user is authenticated
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && permission === 'granted') {
            // Check for existing subscription
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
  }, []);
  
  return {
    isSupported,
    subscription,
    permissionStatus,
    isLoading,
    error,
    subscribeToNotifications
  };
}

// Utility function to convert base64 string to Uint8Array
function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
