
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { urlB64ToUint8Array } from '../utils/pushUtils';

export const useNotificationSender = () => {
  const [isSending, setIsSending] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user } = useAuth();

  const registerServiceWorker = async () => {
    try {
      setIsRegistering(true);
      console.log('Registering service worker...');
      
      // Check for existing registrations
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();
      const hasExistingWorker = existingRegistrations.some(registration => 
        registration.active && registration.active.scriptURL.includes('service-worker.js')
      );

      let registration;
      if (hasExistingWorker) {
        registration = existingRegistrations.find(reg => 
          reg.active && reg.active.scriptURL.includes('service-worker.js')
        );
        console.log('Using existing service worker registration');
      } else {
        registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('New service worker registered');
      }

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  const subscribeToPushNotifications = async (registration: ServiceWorkerRegistration) => {
    console.log('Subscribing to push notifications...');
    
    // Get VAPID public key
    const { data: { publicKey }, error: keyError } = await supabase.functions.invoke('notifications', {
      body: { action: 'getVapidKey' }
    });

    if (keyError || !publicKey) {
      throw new Error('Failed to retrieve VAPID public key');
    }

    // Convert VAPID key
    const convertedVapidKey = urlB64ToUint8Array(publicKey);

    // Get existing subscription or create new one
    const existingSubscription = await registration.pushManager.getSubscription();
    
    if (existingSubscription) {
      console.log('Using existing push subscription');
      return existingSubscription;
    }

    // Create new subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    console.log('Created new push subscription');
    return subscription;
  };

  const sendNotification = async () => {
    if (!user) {
      throw new Error("Authentication Required");
    }

    try {
      setIsSending(true);
      console.log('Initiating notification send process...');
      
      // Register service worker and get subscription
      const registration = await registerServiceWorker();
      const subscription = await subscribeToPushNotifications(registration);
      
      const { data, error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'createNotification',
          params: {
            recipientId: user.id,
            title: "Test Push Notification",
            content: "This is a test push notification from your dashboard!",
            priority: "medium",
            categoryId: "test",
            metadata: {
              source: "notification-tester",
              timestamp: new Date().toISOString(),
              subscription: subscription.toJSON()
            }
          }
        }
      });

      if (error) throw error;
      
      const pushStatus = data?.push_status;
      
      if (!pushStatus?.success) {
        throw new Error(pushStatus?.error || 'Push notification failed to send');
      }

      return pushStatus;
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    isRegistering,
    sendNotification
  };
};
