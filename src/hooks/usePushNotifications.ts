
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
        setSubscription(existingSubscription);
        return existingSubscription;
      }

      // Create new subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
      });

      // Save subscription to database
      const { error } = await supabase
        .from('push_notification_subscriptions')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          endpoint: subscription.endpoint,
          p256dh: btoa(String.fromCharCode.apply(null, 
            new Uint8Array(subscription.getKey('p256dh') as ArrayBuffer))),
          auth: btoa(String.fromCharCode.apply(null, 
            new Uint8Array(subscription.getKey('auth') as ArrayBuffer))),
          device_info: {
            userAgent: navigator.userAgent,
            language: navigator.language
          }
        });

      if (error) throw error;

      setSubscription(subscription);
      toast({
        title: "Success",
        description: "Push notifications have been enabled",
      });

      return subscription;
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

      await subscription.unsubscribe();
      
      // Remove subscription from database
      const { error } = await supabase
        .from('push_notification_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);

      if (error) throw error;

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
