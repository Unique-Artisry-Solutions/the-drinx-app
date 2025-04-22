
import { useState } from 'react';

export const useRetryState = () => {
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [retryHistory, setRetryHistory] = useState<Array<{timestamp: Date, success: boolean}>>([]);

  const incrementRetry = (success: boolean) => {
    setRetryCount(prev => prev + 1);
    setRetryHistory(prev => [...prev, {timestamp: new Date(), success}]);
  };

  const resetRetry = () => {
    setRetryCount(0);
    setRetryHistory([]);
  };

  return {
    isRetrying,
    setIsRetrying,
    retryCount,
    incrementRetry,
    resetRetry,
    retryHistory
  };
};
