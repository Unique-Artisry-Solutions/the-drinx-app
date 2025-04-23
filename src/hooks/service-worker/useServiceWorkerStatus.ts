
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

  useEffect(() => {
    const handlePermissionChange = () => {
      console.log('Permission change detected, refreshing status...');
      refreshPermissionStatus();
      
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

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' as PermissionName })
        .then(status => {
          status.onchange = handlePermissionChange;
        })
        .catch(error => {
          console.error('Error setting up permission monitoring:', error);
        });
    }

    refreshPermissionStatus();

    return () => {
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' as PermissionName })
          .then(status => {
            status.onchange = null;
          })
          .catch(() => {});
      }
    };
  }, [refreshPermissionStatus]);

  useEffect(() => {
    const checkWorkerStatus = async () => {
      try {
        await checkServiceWorkerSupport();

        if ('serviceWorker' in navigator) {
          // Add a direct check with the service worker
          let isActive = false;
          
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            isActive = registrations.some(registration => 
              registration.active && registration.active.scriptURL.includes('service-worker.js')
            );
            
            // If we have an active service worker, try to communicate with it
            if (isActive) {
              // Create a MessageChannel for direct communication
              const messageChannel = new MessageChannel();
              const promise = new Promise<boolean>((resolve) => {
                messageChannel.port1.onmessage = (event) => {
                  if (event.data && event.data.status === 'active') {
                    console.log('Service worker confirmed active via messaging', event.data);
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                };
                
                // Set a timeout in case the service worker doesn't respond
                setTimeout(() => resolve(false), 1000);
              });
              
              // Send a ping to the service worker
              if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                  action: 'checkServiceWorker'
                }, [messageChannel.port2]);
                
                // Wait for the response or timeout
                const isResponsive = await promise;
                if (isResponsive) {
                  isActive = true;
                } else {
                  console.log('Service worker did not respond to message');
                }
              }
            }
          } catch (error) {
            console.error('Error checking service worker registrations:', error);
          }

          setHasServiceWorker(isActive);
          console.log('Service worker status check:', isActive ? 'Active' : 'Not active');

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
