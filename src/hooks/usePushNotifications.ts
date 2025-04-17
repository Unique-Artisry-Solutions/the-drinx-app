
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { PushSubscription } from '@/types/NotificationTypes';

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSupport = async () => {
      setIsSupported(
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
      );
    };
    checkSupport();
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  const subscribeToPushNotifications = async () => {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Register service worker
      const registration = await registerServiceWorker();

      // Get push subscription
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
        return existingSubscription;
      }

      // Create new subscription
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
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
        .upsert(subscriptionData);

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
        description: "Failed to enable push notifications",
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
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications
  };
}
