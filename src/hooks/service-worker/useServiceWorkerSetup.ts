
import { useEffect } from 'react';
import { useRetry } from '@/hooks/useRetry';
import { useRetryState } from './useRetryState';
import { useServiceWorkerRegistration } from './useServiceWorkerRegistration';

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
  const { checkServiceWorker, hasServiceWorker, isCheckingServiceWorker, registrationError } = useServiceWorkerRegistration();

  useEffect(() => {
    // Skip service worker setup in Lovable preview
    if (isLovablePreview()) {
      console.log('Skipping service worker setup in Lovable preview');
      return;
    }
    
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
    hasServiceWorker: isLovablePreview() ? false : hasServiceWorker,
    isCheckingServiceWorker,
    registrationError,
    isRetrying,
    isLovablePreview: isLovablePreview()
  };
};
