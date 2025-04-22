
import { useState, useEffect } from 'react';
import { useRetry } from '@/hooks/useRetry';
import { useServiceWorkerRegistration } from './service-worker/useServiceWorkerRegistration';
import { useServiceWorkerStatus } from './service-worker/useServiceWorkerStatus';

export const useServiceWorker = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { executeWithRetry } = useRetry();
  
  const {
    hasServiceWorker,
    setHasServiceWorker,
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport
  } = useServiceWorkerStatus();

  const {
    registerServiceWorker,
    registrationError,
    setRegistrationError
  } = useServiceWorkerRegistration();

  const checkServiceWorker = async () => {
    try {
      await checkServiceWorkerSupport();
      await registerServiceWorker();
      console.log('Service worker check completed successfully');
      setHasServiceWorker(true);
    } catch (error) {
      console.error('Error checking/registering service worker:', error);
      setHasServiceWorker(false);
      setRegistrationError(error instanceof Error ? error.message : 'Failed to setup service worker');
      throw error;
    } finally {
      setIsCheckingServiceWorker(false);
    }
  };

  useEffect(() => {
    const setupServiceWorker = async () => {
      setIsRetrying(true);
      try {
        await executeWithRetry(checkServiceWorker, 3);
      } catch (error) {
        console.error('Service worker setup failed after multiple attempts:', error);
      } finally {
        setIsRetrying(false);
      }
    };

    setupServiceWorker();
  }, []);

  return {
    hasServiceWorker,
    isCheckingServiceWorker,
    registrationError,
    isRetrying
  };
};
