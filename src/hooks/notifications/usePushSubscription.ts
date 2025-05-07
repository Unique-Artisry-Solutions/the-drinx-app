
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PushSubscription } from '@/types/notification';
import { urlB64ToUint8Array } from '@/hooks/utils/pushUtils';

// Maximum number of retries for getting VAPID key
const MAX_VAPID_RETRIES = 3;

export function usePushSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get VAPID public key with retry logic
  const getVapidPublicKey = async (): Promise<string> => {
    for (let i = 0; i <= MAX_VAPID_RETRIES; i++) {
      try {
        console.log(`Attempting to get VAPID public key (attempt ${i + 1}/${MAX_VAPID_RETRIES + 1})`);
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
        
        if (i === MAX_VAPID_RETRIES) {
          throw error;
        }
        
        // Exponential backoff with max of 5 seconds
        await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, i), 5000)));
      }
    }
    
    throw new Error('Failed to retrieve VAPID public key after retries');
  };

  // Save subscription to the backend
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

  // Create a new push subscription
  const createPushSubscription = async (serviceWorkerReg: ServiceWorkerRegistration, userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check for existing subscription
      let pushSubscription = await serviceWorkerReg.pushManager.getSubscription();
      
      if (!pushSubscription) {
        // Get VAPID key and convert to Uint8Array
        const vapidPublicKey = await getVapidPublicKey();
        const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);
        
        // Create new subscription
        try {
          pushSubscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
          });
          console.log('Created new push subscription:', pushSubscription);
        } catch (subscribeError: any) {
          console.error('Error subscribing to push:', subscribeError);
          if (subscribeError.name === 'NotAllowedError') {
            throw new Error('Push subscription permission was denied');
          } else {
            throw subscribeError;
          }
        }
      } else {
        console.log('Using existing push subscription:', pushSubscription);
      }
      
      // Save subscription to the backend
      const savedSubscription = await saveSubscription(
        pushSubscription.toJSON(), 
        userId
      );
      
      if (!savedSubscription) {
        throw new Error('Failed to save push subscription');
      }
      
      return savedSubscription;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset subscription state
  const resetSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          await subscription.unsubscribe();
          console.log('Existing push subscription cleared');
        }
      }
    } catch (error) {
      console.error('Error resetting subscription:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createPushSubscription,
    resetSubscription,
    isLoading,
    error
  };
}
