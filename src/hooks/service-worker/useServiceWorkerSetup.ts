
import { useServiceWorkerStatus } from './useServiceWorkerStatus';
import { useServiceWorkerRegistration } from './useServiceWorkerRegistration';

export const useServiceWorkerSetup = () => {
  const {
    hasServiceWorker,
    setHasServiceWorker,
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport
  } = useServiceWorkerStatus();

  const {
    registerServiceWorker,
    registrationError,
    setRegistrationError
  } = useServiceWorkerRegistration();

  const checkServiceWorker = async () => {
    try {
      await checkServiceWorkerSupport();
      await registerServiceWorker();
      console.log('Service worker check completed successfully');
      setHasServiceWorker(true);
    } catch (error) {
      console.error('Error checking/registering service worker:', error);
      setHasServiceWorker(false);
      setRegistrationError(error instanceof Error ? error.message : 'Failed to setup service worker');
      throw error;
    } finally {
      setIsCheckingServiceWorker(false);
    }
  };

  return {
    checkServiceWorker,
    hasServiceWorker,
    isCheckingServiceWorker,
    registrationError
  };
};
