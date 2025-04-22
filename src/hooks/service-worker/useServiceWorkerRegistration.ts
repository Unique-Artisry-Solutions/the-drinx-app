
import { useState } from 'react';
import { useRegistrationError } from './useRegistrationError';
import { useRegistrationProcess } from './useRegistrationProcess';
import { debouncedToast } from '@/utils/debouncedToast';

export const useServiceWorkerRegistration = () => {
  const { registrationError, setRegistrationError } = useRegistrationError();
  const { registerWorker } = useRegistrationProcess();
  const [isRegistering, setIsRegistering] = useState(false);

  const registerServiceWorker = async () => {
    try {
      setIsRegistering(true);
      setRegistrationError(null);
      
      console.log('Starting service worker registration...');
      await registerWorker();
      
      // Show success toast
      debouncedToast.success(
        "Service Worker Ready", 
        "Notification service worker is now active"
      );
      
      return true;
    } catch (error) {
      console.error('Error registering service worker:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register service worker';
      setRegistrationError(errorMessage);
      
      // Show error toast
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
    isRegistering
  };
};
