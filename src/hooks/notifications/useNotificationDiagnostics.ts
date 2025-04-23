import { useState, useCallback, useEffect } from 'react';
import { debouncedToast } from '@/utils/debouncedToast';

type DiagnosticsData = Record<string, any>;

// Helper functions
const checkActiveServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) return false;
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.some(
      reg => reg.active && reg.active.scriptURL.includes('service-worker.js')
    );
  } catch (e) {
    console.error('Error checking service worker status:', e);
    return false;
  }
};

export function useNotificationDiagnostics({ resetSubscriptionState }: { resetSubscriptionState: () => Promise<void> }) {
  const [diagnosticsData, setDiagnosticsData] = useState<DiagnosticsData>({});
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'checking' | 'active' | 'inactive'>('checking');
  const [hasJustReset, setHasJustReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Diagnostics runner - collect system information
  const collectDiagnosticsData = useCallback(async (): Promise<DiagnosticsData> => {
    const data: DiagnosticsData = {
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      permission: 'Notification' in window ? Notification.permission : 'API not available',
      controller: !!navigator.serviceWorker?.controller,
      registrations: []
    };
    
    // Get service worker registrations data
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        data.registrations = registrations.map(reg => ({
          scope: reg.scope,
          active: !!reg.active,
          installing: !!reg.installing,
          waiting: !!reg.waiting,
          scriptURL: reg.active?.scriptURL || 'N/A'
        }));
        
        // Check controller communication
        if (navigator.serviceWorker.controller) {
          const messageChannel = new MessageChannel();
          const promise = new Promise<boolean>((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              data.serviceWorkerResponse = event.data;
              resolve(true);
            };
            
            setTimeout(() => {
              data.serviceWorkerTimeout = true;
              resolve(false);
            }, 1000);
          });
          
          navigator.serviceWorker.controller.postMessage({
            action: 'ping',
            timestamp: new Date().toISOString()
          }, [messageChannel.port2]);
          
          await promise;
        }
      } catch (e) {
        data.registrationsError = e instanceof Error ? e.message : 'Unknown error';
      }
    }
    
    return data;
  }, []);

  // Diagnostics runner
  const runDiagnostics = useCallback(async () => {
    // Don't run diagnostics if we're in the middle of a reset
    if (isResetting) return;
    
    setServiceWorkerStatus('checking');
    
    try {
      // Collect the diagnostic data
      const data = await collectDiagnosticsData();
      
      // Update service worker status
      const hasActiveServiceWorker = data.registrations && 
        Array.isArray(data.registrations) && 
        data.registrations.some(
          (reg: any) => reg.active && reg.scriptURL.includes('service-worker.js')
        );
      
      setServiceWorkerStatus(hasActiveServiceWorker ? 'active' : 'inactive');
      setDiagnosticsData(data);
      
      // Don't show toast if this is running right after a reset
      if (!hasJustReset) {
        debouncedToast.info(
          "Diagnostics Complete",
          "System diagnostics information has been collected"
        );
      }
    } catch (error) {
      console.error('Error running diagnostics:', error);
      setServiceWorkerStatus('inactive');
    }
  }, [collectDiagnosticsData, hasJustReset, isResetting]);

  // Reset logic with safeguards against infinite loops
  const handleReset = useCallback(async (): Promise<void> => {
    if (isResetting) return;
    
    try {
      setIsResetting(true);
      setServiceWorkerStatus('checking');
      
      // First, reset subscription state
      await resetSubscriptionState();
      
      // Then unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
        console.log('Unregistered all service workers during reset');
      }
      
      // Notify user
      debouncedToast.info(
        "Reset Complete",
        "Notification system has been reset"
      );
      
      // Mark that we've just reset, which will trigger a single diagnostic run
      setHasJustReset(true);
      
      // Ask if user wants to reload
      if (window.confirm('Reset complete. Reload the page to ensure a clean state?')) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during reset:', error);
      debouncedToast.error(
        "Reset Error",
        error instanceof Error ? error.message : "Failed to reset notification system"
      );
    } finally {
      setIsResetting(false);
    }
  }, [resetSubscriptionState, isResetting]);

  // After a reset, run diagnostics once and clear the flag
  const onHasJustResetUsed = useCallback(() => setHasJustReset(false), []);
  
  // Clean up effect when hasJustReset changes
  useEffect(() => {
    if (hasJustReset && !isResetting) {
      const timer = setTimeout(() => {
        runDiagnostics();
        onHasJustResetUsed();
      }, 500); // Small delay to ensure things have settled
      
      return () => clearTimeout(timer);
    }
  }, [hasJustReset, isResetting, onHasJustResetUsed, runDiagnostics]);

  return {
    diagnosticsData,
    serviceWorkerStatus,
    runDiagnostics,
    handleReset,
    hasJustReset,
    onHasJustResetUsed,
    isResetting,
    setDiagnosticsData,
    setServiceWorkerStatus
  };
}
