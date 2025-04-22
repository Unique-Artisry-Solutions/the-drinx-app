
import { useState, useEffect } from 'react';
import { useServiceWorkerCheck } from './useServiceWorkerCheck';

export const useServiceWorkerStatus = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();

  // Check service worker status on mount
  useEffect(() => {
    const checkWorkerStatus = async () => {
      try {
        await checkServiceWorkerSupport();
        
        // Check if we have an active service worker
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          const isActive = registrations.some(registration => 
            registration.active && registration.active.scriptURL.includes('service-worker.js')
          );
          
          setHasServiceWorker(isActive);
          console.log('Service worker status check:', isActive ? 'Active' : 'Not active');
        }
      } catch (error) {
        console.error('Error checking service worker status:', error);
        setHasServiceWorker(false);
      } finally {
        setIsCheckingServiceWorker(false);
      }
    };
    
    checkWorkerStatus();
  }, [checkServiceWorkerSupport, setIsCheckingServiceWorker]);

  return {
    hasServiceWorker,
    setHasServiceWorker,
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport
  };
};
