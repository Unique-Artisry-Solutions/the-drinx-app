
import { useState, useEffect, useCallback } from 'react';
import { useServiceWorkerCheck } from './useServiceWorkerCheck';
import { debouncedToast } from '@/utils/debouncedToast';

export const useServiceWorkerStatus = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [lastPermissionCheck, setLastPermissionCheck] = useState<Date>(new Date());
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();

  const refreshPermissionStatus = useCallback(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermissionStatus(currentPermission);
      setLastPermissionCheck(new Date());
      console.log('Permission status refreshed:', currentPermission, new Date().toISOString());
      return currentPermission;
    }
    return null;
  }, []);

  // Watch for permission changes
  useEffect(() => {
    const handlePermissionChange = () => {
      console.log('Permission change detected, refreshing status...');
      refreshPermissionStatus();
      
      // Clear existing service worker registrations on permission change
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister().then(success => {
              console.log('Service worker unregistered:', success);
              setHasServiceWorker(false);
            });
          });
        });
      }
    };

    // Set up permission change monitoring
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' as PermissionName })
        .then(status => {
          status.onchange = handlePermissionChange;
        })
        .catch(error => {
          console.error('Error setting up permission monitoring:', error);
        });
    }

    // Initial permission check
    refreshPermissionStatus();

    return () => {
      // Cleanup permission monitoring
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' as PermissionName })
          .then(status => {
            status.onchange = null;
          })
          .catch(() => {});
      }
    };
  }, [refreshPermissionStatus]);

  // Check service worker and permission status on mount
  useEffect(() => {
    const checkWorkerStatus = async () => {
      try {
        await checkServiceWorkerSupport();
        
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          const isActive = registrations.some(registration => 
            registration.active && registration.active.scriptURL.includes('service-worker.js')
          );
          
          setHasServiceWorker(isActive);
          console.log('Service worker status check:', isActive ? 'Active' : 'Not active');
          
          // Show notification if permission granted but no service worker
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
  }, [checkServiceWorkerSupport, setIsCheckingServiceWorker, permissionStatus]);

  return {
    hasServiceWorker,
    setHasServiceWorker,
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport,
    permissionStatus,
    refreshPermissionStatus,
    lastPermissionCheck
  };
};
