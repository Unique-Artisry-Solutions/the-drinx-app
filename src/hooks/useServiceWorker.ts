
import { useEffect, useState } from 'react';
import { isPreviewEnvironment } from '@/utils/environment';

export const useServiceWorker = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [isCheckingServiceWorker, setIsCheckingServiceWorker] = useState(true);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  
  useEffect(() => {
    // Immediately return if in preview environment
    if (isPreviewEnvironment()) {
      console.log('Preview environment detected: skipping service worker setup');
      setIsCheckingServiceWorker(false);
      return;
    }

    const setupServiceWorker = async () => {
      try {
        // Check if service workers are supported
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service worker registered:', registration);
          setHasServiceWorker(true);
        } else {
          console.log('Service workers not supported');
          setHasServiceWorker(false);
        }
      } catch (error) {
        console.error('Error registering service worker:', error);
        setRegistrationError(error instanceof Error ? error.message : 'Failed to setup service worker');
        setHasServiceWorker(false);
      } finally {
        setIsCheckingServiceWorker(false);
      }
    };

    setupServiceWorker();
  }, []);

  return {
    hasServiceWorker,
    isCheckingServiceWorker,
    registrationError
  };
};
