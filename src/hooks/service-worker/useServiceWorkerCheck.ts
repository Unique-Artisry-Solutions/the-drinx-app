
import { useState } from 'react';
import { debugLogger } from '@/utils/debugLogger';

export const useServiceWorkerCheck = () => {
  const [isCheckingServiceWorker, setIsCheckingServiceWorker] = useState(true);

  const checkServiceWorkerSupport = async () => {
    try {
      debugLogger.debug('service-worker', 'Checking service worker support...');
      
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported in this browser');
      }
      
      return true;
    } catch (error) {
      debugLogger.error('service-worker', 'Service worker not supported:', error);
      throw error;
    }
  };

  return {
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport
  };
};
