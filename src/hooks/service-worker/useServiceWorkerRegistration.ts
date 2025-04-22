
import { useRegistrationError } from './useRegistrationError';
import { useRegistrationProcess } from './useRegistrationProcess';

export const useServiceWorkerRegistration = () => {
  const { registrationError, setRegistrationError } = useRegistrationError();
  const { registerWorker } = useRegistrationProcess();

  const registerServiceWorker = async () => {
    try {
      setRegistrationError(null);
      await registerWorker();
      return true;
    } catch (error) {
      console.error('Error registering service worker:', error);
      setRegistrationError(error instanceof Error ? error.message : 'Failed to register service worker');
      throw error;
    }
  };

  return {
    registerServiceWorker,
    registrationError,
    setRegistrationError
  };
};
