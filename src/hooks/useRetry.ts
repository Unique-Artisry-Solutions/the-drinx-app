
import { useCallback, useState, useRef } from 'react';

interface RetryConfig {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onFailure?: (error: Error, attempts: number) => void;
}

export const useRetry = (config: RetryConfig = {}) => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 5000,
    onRetry,
    onFailure
  } = config;
  
  const [attempts, setAttempts] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const retryingRef = useRef<boolean>(false);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> => {
    try {
      const isNewRetry = attempt > 1 && !retryingRef.current;
      if (isNewRetry) {
        setIsRetrying(true);
        retryingRef.current = true;
      }
      
      setAttempts(attempt);
      return await operation();
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      setLastError(typedError);
      
      if (attempt >= maxAttempts) {
        if (onFailure) {
          onFailure(typedError, attempt);
        }
        throw typedError;
      }

      // Calculate exponential backoff with jitter
      const delay = Math.min(
        Math.pow(2, attempt) * baseDelay + Math.random() * 1000,
        maxDelay
      );

      // Notify retry if callback provided
      if (onRetry) {
        onRetry(attempt, typedError);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Recursive retry with incremented attempt count
      return executeWithRetry(operation, attempt + 1);
    } finally {
      if (attempt === maxAttempts || attempt === 1) {
        setIsRetrying(false);
        retryingRef.current = false;
      }
    }
  }, [maxAttempts, baseDelay, maxDelay, onRetry, onFailure]);

  const reset = useCallback(() => {
    setAttempts(0);
    setIsRetrying(false);
    setLastError(null);
    retryingRef.current = false;
  }, []);

  return { 
    executeWithRetry,
    isRetrying,
    attempts,
    lastError,
    reset
  };
};
