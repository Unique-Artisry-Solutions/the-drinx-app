
import { useEffect } from 'react';
import { useRetry } from '@/hooks/useRetry';
import { useRetryState } from './service-worker/useRetryState';
import { useServiceWorkerSetup } from './service-worker/useServiceWorkerSetup';

export const useServiceWorker = () => {
  const { isRetrying, setIsRetrying } = useRetryState();
  const { executeWithRetry } = useRetry();
  const { checkServiceWorker, hasServiceWorker, isCheckingServiceWorker, registrationError } = useServiceWorkerSetup();

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
