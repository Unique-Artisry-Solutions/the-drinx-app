
import { useState } from 'react';

export const useServiceWorkerRegistration = () => {
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const registerServiceWorker = async () => {
    try {
      setRegistrationError(null);
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
      
      return true;
    } catch (error) {
      console.error('Error registering service worker:', error);
      setRegistrationError(error instanceof Error ? error.message : 'Failed to register service worker');
      throw error;
    }
  };

  return {
    registerServiceWorker,
    registrationError,
    setRegistrationError
  };
};
