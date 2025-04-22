
import { useState } from 'react';

export const useServiceWorkerState = () => {
  const [hasServiceWorker, setHasServiceWorker] = useState(false);

  return {
    hasServiceWorker,
    setHasServiceWorker
  };
};
