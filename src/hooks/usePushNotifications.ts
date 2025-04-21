
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
    let isMounted = true;
    
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 
                       'PushManager' in window &&
                       'Notification' in window;
      
      if (!isMounted) return;
      setIsSupported(supported);
      
      if (supported) {
        try {
          // Request permission if not already granted
          const permission = await Notification.requestPermission();
          if (!isMounted) return;
          
          setPermissionStatus(permission);
          
          if (permission === 'granted') {
            // Attempt to register service worker
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            
            // Fetch VAPID public key from Supabase
            const { data: { publicKey }, error: keyError } = await supabase
              .functions.invoke('notifications', {
                body: { action: 'getVapidKey' }
              });

            if (keyError || !publicKey) {
              throw new Error('Failed to retrieve VAPID public key');
            }

            // Subscribe to push notifications
            const pushSubscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKey
            });

            // Convert subscription to our custom format
            const subData: PushSubscription = {
              user_id: (await supabase.auth.getUser()).data.user?.id || '',
              endpoint: pushSubscription.endpoint,
              p256dh: btoa(String.fromCharCode.apply(null, 
                new Uint8Array(pushSubscription.getKey('p256dh') as ArrayBuffer))),
              auth: btoa(String.fromCharCode.apply(null, 
                new Uint8Array(pushSubscription.getKey('auth') as ArrayBuffer)))
            };

            // Save subscription to database
            const { error } = await supabase
              .from('push_notification_subscriptions')
              .insert(subData);

            if (error) throw error;

            setSubscription(subData);
            
            toast({
              title: "Push Notifications",
              description: "Successfully subscribed to push notifications!",
            });
          }
        } catch (error) {
          console.error('Push Notification Setup Error:', error);
          toast({
            title: "Notification Error",
            description: "Failed to set up push notifications",
            variant: "destructive"
          });
        }
      }
    };
    
    checkSupport();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isSupported,
    subscription,
    permissionStatus
  };
}
