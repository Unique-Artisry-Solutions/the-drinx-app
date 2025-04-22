
import { useState, useEffect } from 'react';
import { useServiceWorkerCheck } from './useServiceWorkerCheck';
import { debouncedToast } from '@/utils/debouncedToast';

export const useServiceWorkerStatus = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();

  // Check permission status
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      
      // Log current permission state
      console.log('Current notification permission:', Notification.permission);
    }
  }, []);

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
          
          // If permission was granted but we have no service worker, show a notification
          if (Notification.permission === 'granted' && !isActive) {
            debouncedToast.info(
              "Service Worker Required", 
              "Permissions are granted but service worker needs to be initialized"
            );
          }
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

  // Function to manually refresh permission status
  const refreshPermissionStatus = () => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermissionStatus(currentPermission);
      console.log('Permission status refreshed:', currentPermission);
      return currentPermission;
    }
    return null;
  };

  return {
    hasServiceWorker,
    setHasServiceWorker,
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport,
    permissionStatus,
    refreshPermissionStatus
  };
};
