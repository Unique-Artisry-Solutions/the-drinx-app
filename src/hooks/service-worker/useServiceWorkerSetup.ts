
import { useEffect } from 'react';
import { useRetry } from '@/hooks/useRetry';
import { useRetryState } from './useRetryState';
import { useServiceWorkerRegistration } from './useServiceWorkerRegistration';
import { useServiceWorkerState } from './useServiceWorkerState';
import { useServiceWorkerCheck } from './useServiceWorkerCheck';
import { isLovablePreview, previewLog } from '@/utils/environment';

export const useServiceWorkerSetup = () => {
  const { isRetrying, setIsRetrying } = useRetryState();
  const { executeWithRetry } = useRetry();
  const { hasServiceWorker, setHasServiceWorker } = useServiceWorkerState();
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();
  const { registerServiceWorker, registrationError } = useServiceWorkerRegistration();

  useEffect(() => {
    // Skip service worker setup in Lovable preview
    if (isLovablePreview()) {
      previewLog('Skipping service worker setup in preview environment');
      setIsCheckingServiceWorker(false);
      setHasServiceWorker(false);
      setIsRetrying(false);
      return;
    }
    
    const setupServiceWorker = async () => {
      setIsRetrying(true);
      setIsCheckingServiceWorker(true);
      try {
        // First check if service workers are supported
        await executeWithRetry(checkServiceWorkerSupport, 3);
        
        // Then try to register the service worker
        const result = await executeWithRetry(() => registerServiceWorker(), 3);
        setHasServiceWorker(!!result);
      } catch (error) {
        console.error('Service worker setup failed after multiple attempts:', error);
        setHasServiceWorker(false);
      } finally {
        setIsRetrying(false);
        setIsCheckingServiceWorker(false);
      }
    };

    setupServiceWorker();
  }, []);

  // In preview mode, return placeholder values
  if (isLovablePreview()) {
    return {
      hasServiceWorker: false,
      isCheckingServiceWorker: false,
      registrationError: null,
      isRetrying: false,
      isLovablePreview: true
    };
  }

  // Normal return for production/development
  return {
    hasServiceWorker,
    isCheckingServiceWorker,
    registrationError,
    isRetrying,
    isLovablePreview: false
  };
};
