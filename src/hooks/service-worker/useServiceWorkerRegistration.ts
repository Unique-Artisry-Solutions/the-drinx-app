
import { useState } from 'react';
import { useRegistrationError } from './useRegistrationError';
import { useRegistrationProcess } from './useRegistrationProcess';
import { debouncedToast } from '@/utils/debouncedToast';

// Detect if we're running in the Lovable preview environment
const isLovablePreview = () => {
  try {
    // Check if we're in an iframe (Lovable preview uses iframe)
    const isInIframe = window !== window.parent;
    
    // Check for specific URL patterns or parameters of Lovable
    const isLovableDomain = window.location.hostname.includes('lovable');
    
    // Check if window has specific Lovable properties
    const hasLovableProps = 'LovablePreview' in window || 
                           document.querySelector('meta[name="lovable-preview"]') !== null;
    
    return isInIframe || isLovableDomain || hasLovableProps;
  } catch (e) {
    // If accessing window.parent throws a security error, we're likely in a cross-origin iframe
    console.log('Error detecting environment, assuming Lovable preview:', e);
    return true;
  }
};

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
      
      // Check if we're in the Lovable preview
      if (isLovablePreview()) {
        console.log('Running in Lovable preview environment - bypassing service worker registration');
        debouncedToast.info(
          "Service Worker Bypassed", 
          "Service worker registration skipped in Lovable preview environment",
          5000
        );
        return null;
      }
      
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
