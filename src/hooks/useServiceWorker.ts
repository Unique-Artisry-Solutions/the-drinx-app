
import { useState, useEffect } from 'react';
import { useRetry } from '@/hooks/useRetry';

export const useServiceWorker = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [isCheckingServiceWorker, setIsCheckingServiceWorker] = useState(true);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const { executeWithRetry } = useRetry();
  const [isRetrying, setIsRetrying] = useState(false);

  const checkServiceWorker = async () => {
    try {
      setRegistrationError(null);
      console.log('Checking service worker support...');
      
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported in this browser');
      }
      
      console.log('Getting service worker registrations...');
      const registrations = await navigator.serviceWorker.getRegistrations();
      const hasActiveWorker = registrations.some(registration => 
        registration.active && registration.active.scriptURL.includes('service-worker.js')
      );
      
      if (!hasActiveWorker) {
        console.log('No active service worker found, registering new one...');
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service worker registered:', registration);
        
        // Wait for the service worker to be ready
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Service worker registration timeout'));
          }, 5000);

          registration.addEventListener('activate', () => {
            clearTimeout(timeout);
            resolve(true);
          });
        });
      }
      
      console.log('Service worker check completed successfully');
      setHasServiceWorker(true);
    } catch (error) {
      console.error('Error checking/registering service worker:', error);
      setHasServiceWorker(false);
      setRegistrationError(error instanceof Error ? error.message : 'Failed to setup service worker');
      throw error;
    } finally {
      setIsCheckingServiceWorker(false);
    }
  };

  useEffect(() => {
    const setupServiceWorker = async () => {
      setIsRetrying(true);
      try {
        await executeWithRetry(
          async () => {
            await checkServiceWorker();
          },
          3
        );
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
