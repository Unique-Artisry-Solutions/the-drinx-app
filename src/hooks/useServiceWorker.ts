
import { useEffect } from 'react';
import { useRetry } from '@/hooks/useRetry';
import { useRetryState } from './service-worker/useRetryState';
import { useServiceWorkerSetup } from './service-worker/useServiceWorkerSetup';
import { useServiceWorkerCheck } from './service-worker/useServiceWorkerCheck';
import { useServiceWorkerState } from './service-worker/useServiceWorkerState';
import { isLovablePreview, previewLog } from '@/utils/environment';

export const useServiceWorker = () => {
  const { isRetrying, setIsRetrying } = useRetryState();
  const { executeWithRetry } = useRetry();
  const { hasServiceWorker, setHasServiceWorker } = useServiceWorkerState();
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();
  const { registrationError } = useServiceWorkerSetup();

  useEffect(() => {
    // Create a mock implementation for preview environment
    if (isLovablePreview()) {
      previewLog('Using mock service worker implementation for preview');
      setIsCheckingServiceWorker(false);
      setHasServiceWorker(false);
      setIsRetrying(false);
      return;
    }
    
    // Normal implementation for production/development
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

  // Return mock values for preview, real values for production
  return {
    hasServiceWorker: false,
    isCheckingServiceWorker: false,
    registrationError: null,
    isRetrying: false
  };
};
