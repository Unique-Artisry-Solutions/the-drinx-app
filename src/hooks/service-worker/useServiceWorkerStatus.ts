
import { useState, useEffect, useCallback, useRef } from 'react';
import { useServiceWorkerCheck } from './useServiceWorkerCheck';
import { debouncedToast } from '@/utils/debouncedToast';

const STATUS_CHECK_INTERVAL = 30000; // 30 seconds

export const useServiceWorkerStatus = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [lastPermissionCheck, setLastPermissionCheck] = useState<Date>(new Date());
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();
  
  // Use a ref to track the last status check to prevent excessive updates
  const lastStatusCheck = useRef<Date>(new Date());
  const statusCheckTimeout = useRef<NodeJS.Timeout>();

  const refreshPermissionStatus = useCallback(() => {
    // Only check if enough time has passed since the last check
    const now = new Date();
    if (now.getTime() - lastStatusCheck.current.getTime() < STATUS_CHECK_INTERVAL) {
      return null;
    }

    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermissionStatus(currentPermission);
      setLastPermissionCheck(now);
      lastStatusCheck.current = now;
      console.log('Permission status refreshed:', currentPermission, now.toISOString());
      return currentPermission;
    }
    return null;
  }, []);

  useEffect(() => {
    const handlePermissionChange = () => {
      console.log('Permission change detected, refreshing status...');
      refreshPermissionStatus();
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          const hasActive = registrations.some(registration => 
            registration.active && registration.active.scriptURL.includes('service-worker.js')
          );
          setHasServiceWorker(hasActive);
          
          // Only show toast if the service worker is not active
          if (Notification.permission === 'granted' && !hasActive) {
            debouncedToast.info(
              "Service Worker Required", 
              "Permissions are granted but service worker needs to be initialized",
              10000 // Increase debounce time to prevent frequent toasts
            );
          }
        });
      }
    };

    // Set up permission change listener
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

    // Set up periodic status check
    const checkStatus = async () => {
      try {
        await checkServiceWorkerSupport();

        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          const hasActive = registrations.some(registration => 
            registration.active && registration.active.scriptURL.includes('service-worker.js')
          );
          setHasServiceWorker(hasActive);
        }
      } catch (error) {
        console.error('Error checking service worker status:', error);
        setHasServiceWorker(false);
      }
    };

    // Initial check
    checkStatus();

    // Set up periodic check
    statusCheckTimeout.current = setInterval(checkStatus, STATUS_CHECK_INTERVAL);

    return () => {
      if (statusCheckTimeout.current) {
        clearInterval(statusCheckTimeout.current);
      }
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' as PermissionName })
          .then(status => {
            status.onchange = null;
          })
          .catch(() => {});
      }
    };
  }, [checkServiceWorkerSupport, refreshPermissionStatus]);

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
