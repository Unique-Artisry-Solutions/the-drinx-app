import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  PaymentError, 
  PaymentErrorType,
  PaymentRetryOptions,
  PaymentErrorContext
} from '@/types/PaymentErrors';
import { categorizeError } from '@/utils/paymentValidation';

const DEFAULT_RETRY_OPTIONS: PaymentRetryOptions = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  retryableErrorTypes: [
    PaymentErrorType.NETWORK,
    PaymentErrorType.SYSTEM
  ]
};

interface RetryState {
  attempts: number;
  isRetrying: boolean;
  lastError: PaymentError | null;
  retryCount: number;
  nextRetryAt: Date | null;
}

export function usePaymentRetry(options: Partial<PaymentRetryOptions> = {}) {
  const { toast } = useToast();
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  
  const [retryState, setRetryState] = useState<RetryState>({
    attempts: 0,
    isRetrying: false,
    lastError: null,
    retryCount: 0,
    nextRetryAt: null
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateDelay = useCallback((attemptNumber: number): number => {
    // Exponential backoff with jitter
    const exponentialDelay = Math.min(
      retryOptions.baseDelay * Math.pow(2, attemptNumber - 1),
      retryOptions.maxDelay
    );
    
    // Add random jitter (±25%)
    const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
    return Math.max(exponentialDelay + jitter, retryOptions.baseDelay);
  }, [retryOptions]);

  const shouldRetry = useCallback((error: PaymentError, attempts: number): boolean => {
    if (attempts >= retryOptions.maxAttempts) {
      return false;
    }
    
    if (!error.retryable) {
      return false;
    }

    return retryOptions.retryableErrorTypes.includes(error.type);
  }, [retryOptions]);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    context: Partial<PaymentErrorContext> = {}
  ): Promise<T> => {
    const attemptOperation = async (attemptNumber: number): Promise<T> => {
      try {
        setRetryState(prev => ({
          ...prev,
          attempts: attemptNumber,
          isRetrying: attemptNumber > 1,
          nextRetryAt: null
        }));

        const result = await operation();
        
        // Success - reset retry state
        setRetryState({
          attempts: 0,
          isRetrying: false,
          lastError: null,
          retryCount: 0,
          nextRetryAt: null
        });

        return result;
      } catch (error) {
        const paymentError = categorizeError(error);
        paymentError.context = {
          ...paymentError.context,
          ...context,
          attemptNumber,
          timestamp: new Date()
        };

        setRetryState(prev => ({
          ...prev,
          lastError: paymentError,
          retryCount: prev.retryCount + 1
        }));

        if (shouldRetry(paymentError, attemptNumber)) {
          const delay = calculateDelay(attemptNumber);
          const nextRetryAt = new Date(Date.now() + delay);
          
          setRetryState(prev => ({
            ...prev,
            nextRetryAt
          }));

          toast({
            title: "Retrying payment...",
            description: `Attempt ${attemptNumber} failed. Retrying in ${Math.round(delay / 1000)} seconds.`,
            variant: "default"
          });

          return new Promise((resolve, reject) => {
            retryTimeoutRef.current = setTimeout(async () => {
              try {
                const result = await attemptOperation(attemptNumber + 1);
                resolve(result);
              } catch (retryError) {
                reject(retryError);
              }
            }, delay);
          });
        } else {
          // No more retries or not retryable
          setRetryState(prev => ({
            ...prev,
            isRetrying: false,
            nextRetryAt: null
          }));

          if (attemptNumber >= retryOptions.maxAttempts) {
            toast({
              title: "Payment failed",
              description: `Payment failed after ${retryOptions.maxAttempts} attempts. Please try again later.`,
              variant: "destructive"
            });
          }

          throw paymentError;
        }
      }
    };

    return attemptOperation(1);
  }, [shouldRetry, calculateDelay, toast, retryOptions.maxAttempts]);

  const manualRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    context: Partial<PaymentErrorContext> = {}
  ): Promise<T> => {
    if (retryState.isRetrying) {
      throw new Error('Retry already in progress');
    }

    return executeWithRetry(operation, context);
  }, [executeWithRetry, retryState.isRetrying]);

  const cancelRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    setRetryState(prev => ({
      ...prev,
      isRetrying: false,
      nextRetryAt: null
    }));
  }, []);

  const reset = useCallback(() => {
    cancelRetry();
    setRetryState({
      attempts: 0,
      isRetrying: false,
      lastError: null,
      retryCount: 0,
      nextRetryAt: null
    });
  }, [cancelRetry]);

  return {
    // State
    ...retryState,
    
    // Actions
    executeWithRetry,
    manualRetry,
    cancelRetry,
    reset,
    
    // Configuration
    retryOptions,
    
    // Computed values
    canRetry: retryState.lastError ? 
      shouldRetry(retryState.lastError, retryState.attempts) : false,
    timeUntilNextRetry: retryState.nextRetryAt ? 
      Math.max(0, retryState.nextRetryAt.getTime() - Date.now()) : 0
  };
}

export type PaymentRetryHook = ReturnType<typeof usePaymentRetry>;