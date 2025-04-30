
import { useState } from 'react';
import { useRegistrationError } from './useRegistrationError';
import { useRegistrationProcess } from './useRegistrationProcess';
import { debouncedToast } from '@/utils/debouncedToast';
import { isLovablePreview, previewLog } from '@/utils/environment';

export const useServiceWorkerRegistration = () => {
  const { registrationError, setRegistrationError } = useRegistrationError();
  const { registerWorker } = useRegistrationProcess();
  const [isRegistering, setIsRegistering] = useState(false);

  const cleanupExistingRegistrations = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('Cleaned up existing service worker registrations');
      } catch (error) {
        console.error('Error cleaning up service workers:', error);
      }
    }
  };

  const registerServiceWorker = async () => {
    // In preview mode, immediately return a mock result
    if (isLovablePreview()) {
      previewLog('Bypassing service worker registration in preview');
      return null;
    }
    
    try {
      setIsRegistering(true);
      setRegistrationError(null);
      
      // Clean up existing registrations first
      await cleanupExistingRegistrations();
      
      console.log('Starting fresh service worker registration...');
      const registration = await registerWorker();
      
      // Verify the service worker is actually active
      if (registration && registration.active) {
        console.log('Service worker is active:', registration.active.scriptURL);
        debouncedToast.success(
          "Service Worker Ready", 
          "Notification service worker is now active"
        );
        return true;
      } else if (registration && (registration.installing || registration.waiting)) {
        // Wait for the service worker to become active
        console.log('Service worker is installing or waiting, monitoring state changes');
        await new Promise((resolve) => {
          const stateChangeListener = () => {
            if (registration.active) {
              resolve(true);
              if (registration.installing) {
                registration.installing.removeEventListener('statechange', stateChangeListener);
              }
              if (registration.waiting) {
                registration.waiting.removeEventListener('statechange', stateChangeListener);
              }
            }
          };
          
          if (registration.installing) {
            registration.installing.addEventListener('statechange', stateChangeListener);
          } else if (registration.waiting) {
            registration.waiting.addEventListener('statechange', stateChangeListener);
          }
          
          // Add a timeout in case the service worker gets stuck
          setTimeout(() => {
            resolve(false);
            console.warn('Service worker activation timed out');
          }, 10000);
        });
        
        debouncedToast.success(
          "Service Worker Ready", 
          "Notification service worker is now active"
        );
        return true;
      } else {
        throw new Error('Service worker registration failed - no active or installing worker');
      }
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
    cleanupExistingRegistrations,
    isLovablePreview: isLovablePreview()
  };
};
