import React from 'react';

export interface NetworkError extends Error {
  code?: string;
  status?: number;
  isNetworkError?: boolean;
  isTimeout?: boolean;
  isOffline?: boolean;
}

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: NetworkError, attempt: number) => boolean;
}

export class NetworkErrorHandler {
  private static defaultRetryOptions: Required<RetryOptions> = {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
    shouldRetry: (error: NetworkError, attempt: number) => {
      // Don't retry on client errors (4xx) except for 408, 429
      if (error.status && error.status >= 400 && error.status < 500) {
        return error.status === 408 || error.status === 429;
      }
      
      // Retry on network errors, timeouts, and server errors
      return error.isNetworkError || error.isTimeout || 
             (error.status && error.status >= 500) ||
             attempt <= 2; // Always retry first 2 attempts
    }
  };

  static isNetworkError(error: any): error is NetworkError {
    return error && (
      error.isNetworkError ||
      error.isTimeout ||
      error.isOffline ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      error.message?.toLowerCase().includes('network') ||
      error.message?.toLowerCase().includes('fetch') ||
      error.message?.toLowerCase().includes('connection')
    );
  }

  static createNetworkError(
    message: string, 
    options: Partial<NetworkError> = {}
  ): NetworkError {
    const error = new Error(message) as NetworkError;
    Object.assign(error, {
      isNetworkError: true,
      isOffline: !navigator.onLine,
      ...options
    });
    return error;
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const config = { ...this.defaultRetryOptions, ...options };
    let lastError: NetworkError;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.normalizeError(error);

        // Check if we should retry
        if (attempt === config.maxRetries || !config.shouldRetry(lastError, attempt)) {
          throw lastError;
        }

        // Calculate delay with exponential backoff
        const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt - 1);
        
        console.warn(
          `Operation failed (attempt ${attempt}/${config.maxRetries}). ` +
          `Retrying in ${delay}ms...`, 
          lastError
        );

        await this.delay(delay);
      }
    }

    throw lastError!;
  }

  static normalizeError(error: any): NetworkError {
    if (this.isNetworkError(error)) {
      return error;
    }

    // Handle Supabase/PostgREST errors
    if (error?.code && typeof error.code === 'string') {
      return this.createNetworkError(
        error.message || 'Database operation failed',
        { 
          code: error.code,
          status: error.status
        }
      );
    }

    // Handle fetch errors
    if (error?.name === 'TypeError' && error.message?.includes('fetch')) {
      return this.createNetworkError(
        'Network request failed',
        { 
          isNetworkError: true,
          isOffline: !navigator.onLine
        }
      );
    }

    // Handle timeout errors
    if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
      return this.createNetworkError(
        'Request timed out',
        { 
          isTimeout: true,
          code: 'TIMEOUT'
        }
      );
    }

    // Generic error
    return this.createNetworkError(
      error?.message || 'An unexpected error occurred',
      { status: error?.status }
    );
  }

  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number = 10000
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(this.createNetworkError(
          `Operation timed out after ${timeoutMs}ms`,
          { isTimeout: true, code: 'TIMEOUT' }
        ));
      }, timeoutMs);
    });

    return Promise.race([operation(), timeoutPromise]);
  }

  static getErrorMessage(error: NetworkError): string {
    if (error.isOffline) {
      return 'You appear to be offline. Please check your internet connection.';
    }

    if (error.isTimeout) {
      return 'The request timed out. Please try again.';
    }

    if (error.isNetworkError) {
      return 'Network error occurred. Please check your connection and try again.';
    }

    if (error.status) {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication required. Please log in again.';
        case 403:
          return 'Access denied. You don\'t have permission for this action.';
        case 404:
          return 'The requested resource was not found.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }

    return error.message || 'An unexpected error occurred.';
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Utility function for common use cases
export async function withNetworkErrorHandling<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return NetworkErrorHandler.withRetry(operation, options);
}

// Hook for network status monitoring
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isReconnecting };
}
