import { useState, useEffect, useCallback } from 'react';
import { useDirectNotifications } from '../useDirectNotifications';
import { debugLogger } from '@/utils/debugLogger';
import { urlB64ToUint8Array } from '../utils/pushUtils';

interface PushSubscriptionState {
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
  lastHealthCheck: Date | null;
}

interface UsePushSubscriptionReturn extends PushSubscriptionState {
  requestPermission: () => Promise<boolean>;
  ensureHealthySubscription: () => Promise<boolean>;
  unsubscribe: () => Promise<void>;
  resetError: () => void;
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const HEALTH_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export const usePushSubscription = (): UsePushSubscriptionReturn => {
  const { isSupported, permissionStatus, checkPermission } = useDirectNotifications();
  
  const [state, setState] = useState<Omit<PushSubscriptionState, 'isSupported' | 'permissionStatus'>>({
    isSubscribed: false,
    subscription: null,
    isLoading: false,
    error: null,
    lastHealthCheck: null,
  });

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const checkSubscriptionHealth = useCallback(async (registration: ServiceWorkerRegistration): Promise<boolean> => {
    try {
      const subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        setState(prev => ({ ...prev, isSubscribed: false, subscription: null }));
        return false;
      }

      // Check if subscription is expired
      const isExpired = subscription.expirationTime && subscription.expirationTime < Date.now();
      
      if (isExpired) {
        debugLogger.warn('notifications', 'Subscription expired, unsubscribing');
        await subscription.unsubscribe();
        setState(prev => ({ ...prev, isSubscribed: false, subscription: null }));
        return false;
      }

      setState(prev => ({ 
        ...prev, 
        isSubscribed: true, 
        subscription,
        lastHealthCheck: new Date()
      }));
      return true;
    } catch (error) {
      debugLogger.error('notifications', 'Health check failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Health check failed',
        isSubscribed: false,
        subscription: null
      }));
      return false;
    }
  }, []);

  const ensureHealthySubscription = useCallback(async (): Promise<boolean> => {
    if (!isSupported || permissionStatus !== 'granted') {
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const isHealthy = await checkSubscriptionHealth(registration);
      
      if (!isHealthy) {
        // Try to create new subscription
        if (!VAPID_PUBLIC_KEY) {
          throw new Error('VAPID public key not configured');
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        setState(prev => ({ 
          ...prev, 
          isSubscribed: true, 
          subscription,
          lastHealthCheck: new Date()
        }));
        
        debugLogger.info('notifications', 'New subscription created');
        return true;
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to ensure healthy subscription';
      setState(prev => ({ ...prev, error: errorMessage }));
      debugLogger.error('notifications', 'ensureHealthySubscription failed:', error);
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [isSupported, permissionStatus, checkSubscriptionHealth]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setState(prev => ({ ...prev, error: 'Push notifications not supported' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const permission = await Notification.requestPermission();
      await checkPermission(); // Update permission status
      
      if (permission === 'granted') {
        await ensureHealthySubscription();
        return true;
      }
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permission';
      setState(prev => ({ ...prev, error: errorMessage }));
      debugLogger.error('notifications', 'requestPermission failed:', error);
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [isSupported, checkPermission, ensureHealthySubscription]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!state.subscription) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await state.subscription.unsubscribe();
      setState(prev => ({ 
        ...prev, 
        isSubscribed: false, 
        subscription: null,
        lastHealthCheck: new Date()
      }));
      debugLogger.info('notifications', 'Successfully unsubscribed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unsubscribe';
      setState(prev => ({ ...prev, error: errorMessage }));
      debugLogger.error('notifications', 'unsubscribe failed:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.subscription]);

  // Auto health check on mount and periodically
  useEffect(() => {
    if (!isSupported || permissionStatus !== 'granted') return;

    const shouldCheck = !state.lastHealthCheck || 
      (Date.now() - state.lastHealthCheck.getTime() > HEALTH_CHECK_INTERVAL);
    
    if (shouldCheck) {
      ensureHealthySubscription();
    }
  }, [isSupported, permissionStatus, ensureHealthySubscription, state.lastHealthCheck]);

  return {
    isSupported,
    permissionStatus,
    ...state,
    requestPermission,
    ensureHealthySubscription,
    unsubscribe,
    resetError,
  };
};