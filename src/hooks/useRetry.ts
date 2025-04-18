
import { useState, useCallback } from 'react';

interface RetryConfig {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export const useRetry = (config: RetryConfig = {}) => {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 5000,
    backoffFactor = 2,
  } = config;

  const [attemptCount, setAttemptCount] = useState(0);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    onError?: (error: any) => void
  ): Promise<T> => {
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setAttemptCount(attempt);
        return await operation();
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt === maxAttempts) {
          onError?.(error);
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }

    throw new Error('Max retry attempts reached');
  }, [maxAttempts, initialDelay, maxDelay, backoffFactor]);

  return {
    executeWithRetry,
    attemptCount,
    isRetrying: attemptCount > 0,
  };
};
