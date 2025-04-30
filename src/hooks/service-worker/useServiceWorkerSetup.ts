
import { useEffect, useState } from 'react';
import { useRetry } from '@/hooks/useRetry';
import { useRetryState } from './useRetryState';
import { useServiceWorkerRegistration } from './useServiceWorkerRegistration';
import { useServiceWorkerState } from './useServiceWorkerState';
import { useServiceWorkerCheck } from './useServiceWorkerCheck';

// Helper to detect Lovable preview environment
const isLovablePreview = () => {
  try {
    // Check if we're in an iframe (Lovable preview uses iframe)
    const isInIframe = window !== window.parent;
    
    // Check for specific URL patterns or parameters of Lovable
    const isLovableDomain = window.location.hostname.includes('lovable');
    
    // Check if window has specific Lovable properties
    const hasLovableProps = 'LovablePreview' in window || 
                           document.querySelector('meta[name="lovable-preview"]') !== null;
    
    return isInIframe || isLovableDomain || hasLovableProps;
  } catch (e) {
    // If accessing window.parent throws a security error, we're likely in a cross-origin iframe
    console.log('Error detecting environment, assuming Lovable preview:', e);
    return true;
  }
};

export const useServiceWorkerSetup = () => {
  const { isRetrying, setIsRetrying } = useRetryState();
  const { executeWithRetry } = useRetry();
  const { hasServiceWorker, setHasServiceWorker } = useServiceWorkerState();
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();
  const { registerServiceWorker, registrationError } = useServiceWorkerRegistration();

  useEffect(() => {
    // Skip service worker setup in Lovable preview
    if (isLovablePreview()) {
      console.log('Skipping service worker setup in Lovable preview');
      setIsCheckingServiceWorker(false);
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

  return {
    hasServiceWorker: isLovablePreview() ? false : hasServiceWorker,
    isCheckingServiceWorker,
    registrationError,
    isRetrying,
    isLovablePreview: isLovablePreview()
  };
};
