
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { urlB64ToUint8Array } from '../utils/pushUtils';
import { useToast } from '@/hooks/use-toast';

export const useNotificationSender = () => {
  const [isSending, setIsSending] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const registerServiceWorker = async () => {
    try {
      setIsRegistering(true);
      console.log('Registering service worker...');
      
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

      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw new Error('Failed to register service worker: ' + error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const subscribeToPushNotifications = async (registration: ServiceWorkerRegistration) => {
    console.log('Subscribing to push notifications...');
    
    try {
      const { data, error } = await supabase.functions.invoke('notifications', {
        body: { action: 'getVapidKey' }
      });

      if (error || !data?.publicKey) {
        throw new Error('Failed to retrieve VAPID key: ' + (error?.message || 'No public key returned'));
      }

      const convertedVapidKey = urlB64ToUint8Array(data.publicKey);
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        console.log('Using existing push subscription');
        return existingSubscription;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      console.log('Created new push subscription');
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw new Error('Push notification setup failed: ' + error.message);
    }
  };

  const sendNotification = async () => {
    if (!user) {
      throw new Error("Authentication Required");
    }

    try {
      setIsSending(true);
      console.log('Initiating notification send process...');
      
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

      if (error) {
        throw error;
      }
      
      if (!data?.push_status?.success) {
        throw new Error(data?.push_status?.error || 'Push notification failed to send');
      }

      toast({
        title: "Success",
        description: "Push notification sent successfully",
      });

      return data.push_status;
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send notification",
        variant: "destructive"
      });
      throw error;
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
