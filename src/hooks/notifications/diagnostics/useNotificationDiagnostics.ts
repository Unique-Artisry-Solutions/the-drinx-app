
import { useState, useEffect } from 'react';

interface NotificationDiagnostics {
  isSupported: boolean;
  permission: NotificationPermission;
  serviceWorkerStatus: 'checking' | 'active' | 'inactive' | 'error';
  serviceWorkerController: boolean;
  serviceWorkerRegistrations: number;
  error: string | null;
}

export function useNotificationDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<NotificationDiagnostics>({
    isSupported: false,
    permission: 'default',
    serviceWorkerStatus: 'checking',
    serviceWorkerController: false,
    serviceWorkerRegistrations: 0,
    error: null
  });

  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const runDiagnostics = async () => {
    try {
      setIsRunningTests(true);
      
      // Check for Notification API support
      const isSupported = 'Notification' in window;
      
      // Check permission status
      const permission = isSupported ? Notification.permission : 'default';
      
      // Check Service Worker support and status
      const swSupported = 'serviceWorker' in navigator;
      let serviceWorkerStatus = 'inactive';
      let serviceWorkerController = false;
      let serviceWorkerRegistrations = 0;
      
      if (swSupported) {
        // Check for controller
        serviceWorkerController = !!navigator.serviceWorker.controller;
        
        // Check for registrations
        const registrations = await navigator.serviceWorker.getRegistrations();
        serviceWorkerRegistrations = registrations.length;
        
        // Determine status
        if (serviceWorkerController) {
          serviceWorkerStatus = 'active';
        } else if (serviceWorkerRegistrations > 0) {
          // Has registrations but not controlling
          serviceWorkerStatus = 'inactive';
        } else {
          serviceWorkerStatus = 'error';
        }
        
        // Check communication with service worker
        if (serviceWorkerController) {
          try {
            // If MessageChannel API available, use it to test communication
            const channel = new MessageChannel();
            const responsePromise = new Promise<boolean>((resolve) => {
              const timeout = setTimeout(() => resolve(false), 1000);
              
              channel.port1.onmessage = (event) => {
                clearTimeout(timeout);
                console.log('[Diagnostics] Received ping response:', event.data);
                resolve(true);
              };
            });
            
            navigator.serviceWorker.controller.postMessage({
              action: 'ping'
            }, [channel.port2]);
            
            const pingSuccess = await responsePromise;
            if (!pingSuccess) {
              console.warn('[Diagnostics] Service worker ping timed out');
            }
          } catch (error) {
            console.error('[Diagnostics] Error testing service worker communication:', error);
          }
        }
      }
      
      // Update diagnostics state
      setDiagnostics({
        isSupported,
        permission,
        serviceWorkerStatus: serviceWorkerStatus as any,
        serviceWorkerController,
        serviceWorkerRegistrations,
        error: null
      });
      
      return {
        isSupported,
        permission,
        serviceWorkerStatus,
        serviceWorkerController,
        serviceWorkerRegistrations
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Diagnostics] Error running diagnostics:', error);
      
      setDiagnostics(prev => ({
        ...prev,
        error: errorMessage,
        serviceWorkerStatus: 'error'
      }));
      
      return {
        error: errorMessage
      };
    } finally {
      setIsRunningTests(false);
    }
  };
  
  const resetServiceWorker = async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported in this browser');
      }
      
      setIsRunningTests(true);
      
      // Unregister all service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
      
      // Reload the page to get a fresh start
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('[Diagnostics] Error resetting service worker:', error);
      setDiagnostics(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to reset Service Worker'
      }));
      
      return false;
    } finally {
      setIsRunningTests(false);
    }
  };
  
  // Run diagnostics on initial load
  useEffect(() => {
    runDiagnostics();
  }, []);
  
  return {
    ...diagnostics,
    isRunningTests,
    runDiagnostics,
    resetServiceWorker
  };
}
