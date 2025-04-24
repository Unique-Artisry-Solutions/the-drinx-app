
import { useState, useEffect } from 'react';
import { useNotificationSupport } from '../useNotificationSupport';

export function useNotificationDiagnostics() {
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'checking' | 'active' | 'inactive' | 'error'>('checking');
  const [serviceWorkerController, setServiceWorkerController] = useState<boolean>(false);
  const [serviceWorkerRegistrations, setServiceWorkerRegistrations] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const { isSupported, permissionStatus: permission, checkPermission } = useNotificationSupport();

  const checkServiceWorker = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      setServiceWorkerRegistrations(registrations.length);
      
      const hasActiveController = !!navigator.serviceWorker.controller;
      setServiceWorkerController(hasActiveController);
      
      if (registrations.length > 0 && hasActiveController) {
        setServiceWorkerStatus('active');
      } else if (registrations.length > 0) {
        setServiceWorkerStatus('inactive');
      } else {
        setServiceWorkerStatus('inactive');
      }
    } catch (err) {
      console.error('Error checking service worker:', err);
      setServiceWorkerStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to check service worker status');
    }
  };

  const runDiagnostics = async () => {
    setIsRunningTests(true);
    try {
      await checkServiceWorker();
      checkPermission();
      
      if (navigator.serviceWorker.controller) {
        // Send diagnostic command to service worker
        navigator.serviceWorker.controller.postMessage({
          action: 'diagnostics',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Diagnostics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run diagnostics');
    } finally {
      setIsRunningTests(false);
    }
  };

  const resetServiceWorker = async () => {
    setIsRunningTests(true);
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
      
      // Force reload to ensure clean state
      window.location.reload();
    } catch (err) {
      console.error('Reset error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset service worker');
      setIsRunningTests(false);
    }
  };

  useEffect(() => {
    checkServiceWorker();
    
    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'SW_DIAGNOSTIC_RESULT') {
        console.log('Received diagnostic result:', event.data);
      }
    };
    
    navigator.serviceWorker.addEventListener('message', messageHandler);
    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    };
  }, []);

  return {
    isSupported,
    permission,
    serviceWorkerStatus,
    serviceWorkerController,
    serviceWorkerRegistrations,
    error,
    isRunningTests,
    runDiagnostics,
    resetServiceWorker
  };
}
