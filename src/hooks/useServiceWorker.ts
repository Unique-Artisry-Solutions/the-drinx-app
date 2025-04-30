
import { useEffect } from 'react';
import { useRetry } from '@/hooks/useRetry';
import { useRetryState } from './service-worker/useRetryState';
import { useServiceWorkerSetup } from './service-worker/useServiceWorkerSetup';
import { useServiceWorkerCheck } from './service-worker/useServiceWorkerCheck';
import { useServiceWorkerState } from './service-worker/useServiceWorkerState';
import { isLovablePreview } from '@/utils/environment';

export const useServiceWorker = () => {
  const { isRetrying, setIsRetrying } = useRetryState();
  const { executeWithRetry } = useRetry();
  const { hasServiceWorker, setHasServiceWorker } = useServiceWorkerState();
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();
  const { registrationError } = useServiceWorkerSetup();

  useEffect(() => {
    // Skip service worker setup in Lovable preview environment
    if (isLovablePreview()) {
      console.log('Skipping service worker setup in Lovable preview');
      setIsCheckingServiceWorker(false);
      setHasServiceWorker(false);
      return;
    }
    
    const setupServiceWorker = async () => {
      setIsRetrying(true);
      try {
        await executeWithRetry(checkServiceWorkerSupport, 3);
        setHasServiceWorker(true);
      } catch (error) {
        console.error('Service worker setup failed after multiple attempts:', error);
        setHasServiceWorker(false);
      } finally {
        setIsRetrying(false);
      }
    };

    setupServiceWorker();
  }, []);

  return {
    hasServiceWorker: isLovablePreview() ? false : hasServiceWorker,
    isCheckingServiceWorker: isLovablePreview() ? false : isCheckingServiceWorker,
    registrationError,
    isRetrying: isLovablePreview() ? false : isRetrying
  };
};
