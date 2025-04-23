
import { useState, useCallback } from 'react';

export function useServiceWorkerRegistration() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  
  // Register service worker with proper error handling
  const registerServiceWorker = useCallback(async () => {
    try {
      setIsRegistering(true);
      setRegistrationError(null);
      
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker API not supported in this browser');
      }
      
      // Check for existing registrations
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();
      const hasExistingWorker = existingRegistrations.some(registration => 
        registration.active && registration.active.scriptURL.includes('service-worker.js')
      );

      let registration;
      if (hasExistingWorker) {
        registration = existingRegistrations.find(reg => 
          reg.active && reg.active.scriptURL.includes('service-worker.js')
        );
        console.log('Using existing service worker registration');
      } else {
        registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('New service worker registered');
      }

      // Wait for service worker to become ready
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error: any) {
      console.error('Service worker registration failed:', error);
      setRegistrationError(error.message || 'Failed to register service worker');
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  // Unregister all service workers
  const unregisterAllServiceWorkers = useCallback(async () => {
    try {
      if (!('serviceWorker' in navigator)) return;
      
      const registrations = await navigator.serviceWorker.getRegistrations();
      const results = await Promise.all(registrations.map(reg => reg.unregister()));
      
      const successCount = results.filter(Boolean).length;
      console.log(`Unregistered ${successCount}/${registrations.length} service workers`);
      
      return successCount === registrations.length;
    } catch (error) {
      console.error('Error unregistering service workers:', error);
      return false;
    }
  }, []);
  
  return {
    registerServiceWorker,
    unregisterAllServiceWorkers,
    isRegistering,
    registrationError
  };
}
