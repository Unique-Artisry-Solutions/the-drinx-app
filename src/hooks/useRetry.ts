
import { useCallback } from 'react';

interface RetryConfig {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export const useRetry = (config: RetryConfig = {}) => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 5000
  } = config;

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }

      // Calculate exponential backoff with jitter
      const delay = Math.min(
        Math.pow(2, attempt) * baseDelay + Math.random() * 1000,
        maxDelay
      );

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Recursive retry with incremented attempt count
      return executeWithRetry(operation, attempt + 1);
    }
  }, [maxAttempts, baseDelay, maxDelay]);

  return { executeWithRetry };
};
