
import { useState } from 'react';

export const useServiceWorkerStatus = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [isCheckingServiceWorker, setIsCheckingServiceWorker] = useState(true);

  const checkServiceWorkerSupport = async () => {
    try {
      console.log('Checking service worker support...');
      
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported in this browser');
      }
      
      return true;
    } catch (error) {
      console.error('Service worker not supported:', error);
      setHasServiceWorker(false);
      throw error;
    }
  };

  return {
    hasServiceWorker,
    setHasServiceWorker,
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport
  };
};
