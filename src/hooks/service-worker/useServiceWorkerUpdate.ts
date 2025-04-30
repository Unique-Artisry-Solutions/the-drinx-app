
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isPreviewEnvironment } from '@/utils/environment';

export function useServiceWorkerUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateServiceWorker = async () => {
    // Skip in preview environment
    if (isPreviewEnvironment()) {
      console.log('Preview environment: skipping service worker update');
      toast({
        title: "Preview Mode",
        description: "Service worker updates are disabled in preview mode.",
      });
      return true;
    }
    
    try {
      setIsUpdating(true);
      
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported in this browser');
      }
      
      // Unregister existing service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      if (registrations.length === 0) {
        console.log('No service worker registrations found');
      } else {
        console.log(`Found ${registrations.length} service worker registrations`);
        await Promise.all(registrations.map(registration => registration.unregister()));
        console.log('All service workers unregistered');
      }
      
      // Register fresh service worker
      console.log('Registering new service worker');
      
      // Add a cache-busting query parameter to force a fresh download
      const timestamp = new Date().getTime();
      const registration = await navigator.serviceWorker.register(`/service-worker.js?v=${timestamp}`);
      
      // Force clients claim
      if (registration.installing) {
        console.log('Service worker installing. Waiting for it to activate...');
        
        await new Promise<void>((resolve) => {
          const stateChangeListener = () => {
            if (registration.active) {
              resolve();
            }
          };
          
          registration.installing.addEventListener('statechange', stateChangeListener);
          
          // Add a timeout in case the service worker gets stuck
          setTimeout(() => {
            console.warn('Timed out waiting for service worker to activate');
            resolve();
          }, 5000);
        });
      }
      
      toast({
        title: "Service Worker Updated",
        description: "The notification service worker has been updated to the latest version.",
      });
      
      // Reload the page to ensure the new service worker takes control
      setTimeout(() => window.location.reload(), 1000);
      
      return true;
    } catch (error) {
      console.error('Error updating service worker:', error);
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update service worker",
      });
      
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateServiceWorker
  };
}
