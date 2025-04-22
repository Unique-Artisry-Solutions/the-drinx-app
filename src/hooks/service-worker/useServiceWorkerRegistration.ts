
import { useState } from 'react';
import { useRegistrationError } from './useRegistrationError';
import { useRegistrationProcess } from './useRegistrationProcess';
import { debouncedToast } from '@/utils/debouncedToast';

export const useServiceWorkerRegistration = () => {
  const { registrationError, setRegistrationError } = useRegistrationError();
  const { registerWorker } = useRegistrationProcess();
  const [isRegistering, setIsRegistering] = useState(false);

  const cleanupExistingRegistrations = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('Cleaned up existing service worker registrations');
    }
  };

  const registerServiceWorker = async () => {
    try {
      setIsRegistering(true);
      setRegistrationError(null);
      
      // Clean up existing registrations first
      await cleanupExistingRegistrations();
      
      console.log('Starting fresh service worker registration...');
      await registerWorker();
      
      debouncedToast.success(
        "Service Worker Ready", 
        "Notification service worker is now active"
      );
      
      return true;
    } catch (error) {
      console.error('Error registering service worker:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register service worker';
      setRegistrationError(errorMessage);
      
      debouncedToast.error(
        "Service Worker Error", 
        errorMessage
      );
      
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerServiceWorker,
    registrationError,
    setRegistrationError,
    isRegistering,
    cleanupExistingRegistrations
  };
};
