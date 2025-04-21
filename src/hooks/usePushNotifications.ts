
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { PushSubscription } from '@/types/NotificationTypes';

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 
                       'PushManager' in window &&
                       'Notification' in window;
      setIsSupported(supported);
      
      if (supported) {
        const permission = await Notification.permission;
        setPermissionStatus(permission);
        
        // If user already has an active service worker, check for existing subscription
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            const subData: PushSubscription = {
              user_id: (await supabase.auth.getUser()).data.user?.id || '',
              endpoint: existingSubscription.endpoint,
              p256dh: btoa(String.fromCharCode.apply(null, 
                new Uint8Array(existingSubscription.getKey('p256dh') as ArrayBuffer))),
              auth: btoa(String.fromCharCode.apply(null, 
                new Uint8Array(existingSubscription.getKey('auth') as ArrayBuffer)))
            };
            setSubscription(subData);
          }
        }
      }
    };
    checkSupport();
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw new Error('Failed to register service worker');
    }
  };

  const subscribeToPushNotifications = async () => {
    try {
      if (permissionStatus === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings to receive updates.",
          variant: "destructive"
        });
        return;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission !== 'granted') {
        toast({
          title: "Permission Required",
          description: "Please allow notifications to receive updates.",
          variant: "destructive"
        });
        return;
      }

      // Get VAPID public key from Supabase Edge Function
      const { data: { publicKey }, error: keyError } = await supabase
        .functions.invoke('notifications', {
          body: { action: 'getVapidKey' }
        });

      if (keyError || !publicKey) {
        console.error('Failed to get VAPID public key:', keyError);
        throw new Error('Failed to get notification configuration');
      }

      // Register service worker
      const registration = await registerServiceWorker();
      console.log('Service Worker registered successfully');

      // Get push subscription
      console.log('Requesting push subscription with VAPID key:', publicKey);
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });

      // Save subscription to database
      const subscriptionData: PushSubscription = {
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        endpoint: pushSubscription.endpoint,
        p256dh: btoa(String.fromCharCode.apply(null, 
          new Uint8Array(pushSubscription.getKey('p256dh') as ArrayBuffer))),
        auth: btoa(String.fromCharCode.apply(null, 
          new Uint8Array(pushSubscription.getKey('auth') as ArrayBuffer))),
        device_info: {
          userAgent: navigator.userAgent,
          language: navigator.language
        }
      };

      const { error } = await supabase
        .from('push_notification_subscriptions')
        .insert(subscriptionData);

      if (error) throw error;

      setSubscription(subscriptionData);
      toast({
        title: "Success",
        description: "Push notifications have been enabled",
      });

      return pushSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enable push notifications",
        variant: "destructive"
      });
      throw error;
    }
  };

  const unsubscribeFromPushNotifications = async () => {
    try {
      if (!subscription) return;

      // Delete from database first
      const { error } = await supabase
        .from('push_notification_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);

      if (error) throw error;

      // Get the service worker registration and unsubscribe
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
      }

      setSubscription(null);
      toast({
        title: "Success",
        description: "Push notifications have been disabled",
      });
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Error",
        description: "Failed to disable push notifications",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    isSupported,
    subscription,
    permissionStatus,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications
  };
}
