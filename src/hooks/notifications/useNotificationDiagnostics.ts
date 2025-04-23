
import { useState, useCallback } from 'react';
import { debouncedToast } from '@/utils/debouncedToast';

type DiagnosticsData = Record<string, any>;

export function useNotificationDiagnostics({ resetSubscriptionState }: { resetSubscriptionState: () => Promise<void> }) {
  const [diagnosticsData, setDiagnosticsData] = useState<DiagnosticsData>({});
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'checking' | 'active' | 'inactive'>('checking');
  const [hasJustReset, setHasJustReset] = useState(false);

  // Diagnostics runner
  const runDiagnostics = useCallback(async () => {
    setServiceWorkerStatus('checking');
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
        const hasActiveServiceWorker = registrations.some(
          reg => reg.active && reg.active.scriptURL.includes('service-worker.js')
        );
        setServiceWorkerStatus(hasActiveServiceWorker ? 'active' : 'inactive');
      } catch (e) {
        data.registrationsError = e instanceof Error ? e.message : 'Unknown error';
        setServiceWorkerStatus('inactive');
      }
    }
    setDiagnosticsData(data);
    debouncedToast.info(
      "Diagnostics Complete",
      "System diagnostics information has been collected"
    );
  }, []);

  // Reset logic
  const handleReset = useCallback(async () => {
    try {
      setServiceWorkerStatus('checking');
      await resetSubscriptionState();
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
        console.log('Unregistered all service workers during reset');
      }
      debouncedToast.info(
        "Reset Complete",
        "Notification system has been reset"
      );
      setHasJustReset(true);
      if (window.confirm('Reset complete. Reload the page to ensure a clean state?')) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during reset:', error);
      debouncedToast.error(
        "Reset Error",
        error instanceof Error ? error.message : "Failed to reset notification system"
      );
    }
  }, [resetSubscriptionState]);

  // After a reset, run diagnostics once and clear the flag
  const onHasJustResetUsed = useCallback(() => setHasJustReset(false), []);

  return {
    diagnosticsData,
    serviceWorkerStatus,
    runDiagnostics,
    handleReset,
    hasJustReset,
    onHasJustResetUsed,
    setDiagnosticsData, // For advanced integration if needed (not required here)
    setServiceWorkerStatus
  };
}
