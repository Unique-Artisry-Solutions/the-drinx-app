
import { useServiceWorkerCheck } from './useServiceWorkerCheck';
import { useServiceWorkerState } from './useServiceWorkerState';

export const useServiceWorkerStatus = () => {
  const { isCheckingServiceWorker, setIsCheckingServiceWorker, checkServiceWorkerSupport } = useServiceWorkerCheck();
  const { hasServiceWorker, setHasServiceWorker } = useServiceWorkerState();

  return {
    hasServiceWorker,
    setHasServiceWorker,
    isCheckingServiceWorker,
    setIsCheckingServiceWorker,
    checkServiceWorkerSupport
  };
};
