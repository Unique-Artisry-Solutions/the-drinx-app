
/**
 * Comprehensive error handling utilities for safe error message extraction and rendering
 */

// Type guard to check if something is an Error object
export const isError = (error: any): error is Error => {
  return error instanceof Error || (error && typeof error.message === 'string');
};

// Type guard to check if something is a string
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

/**
 * Safely extracts a readable error message from any error type
 * This prevents React rendering issues with Error objects
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle null/undefined
  if (error === null || error === undefined) {
    return 'An unknown error occurred';
  }

  // Handle string errors
  if (isString(error)) {
    return error;
  }

  // Handle Error objects
  if (isError(error)) {
    return error.message || 'An error occurred';
  }

  // Handle objects with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as any).message;
    if (isString(message)) {
      return message;
    }
  }

  // Handle objects with error property
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const nestedError = (error as any).error;
    return getErrorMessage(nestedError);
  }

  // Handle Supabase/PostgreSQL errors
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    
    // PostgreSQL error format
    if (errorObj.code && errorObj.details) {
      return `Database error: ${errorObj.message || errorObj.details}`;
    }
    
    // Supabase error format
    if (errorObj.status && errorObj.statusText) {
      return `API error (${errorObj.status}): ${errorObj.statusText}`;
    }
  }

  // Fallback: convert to string
  try {
    const stringified = String(error);
    return stringified === '[object Object]' ? 'An unknown error occurred' : stringified;
  } catch {
    return 'An unknown error occurred';
  }
};

/**
 * Creates a standardized error object for consistent error handling
 */
export const createStandardError = (message: string, originalError?: unknown): StandardError => {
  return {
    message,
    originalError,
    timestamp: new Date().toISOString()
  };
};

/**
 * Standard error interface for consistent error handling
 */
export interface StandardError {
  message: string;
  originalError?: unknown;
  timestamp: string;
}

/**
 * Hook for safe error message extraction in React components
 */
export const useErrorMessage = (error: unknown) => {
  return getErrorMessage(error);
};

/**
 * Utility for logging errors with context
 */
export const logError = (error: unknown, context?: string) => {
  const message = getErrorMessage(error);
  const logMessage = context ? `[${context}] ${message}` : message;
  
  console.error(logMessage, error);
  
  // In production, you might want to send this to an error tracking service
  // Example: errorTrackingService.captureError(error, { context });
};

/**
 * Validates and normalizes error responses from API calls
 */
export const normalizeApiError = (error: unknown): StandardError => {
  const message = getErrorMessage(error);
  
  // Add specific handling for common API errors
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    
    if (errorObj.status === 401) {
      return createStandardError('Authentication required. Please log in again.', error);
    }
    
    if (errorObj.status === 403) {
      return createStandardError('Access denied. You don\'t have permission for this action.', error);
    }
    
    if (errorObj.status === 404) {
      return createStandardError('The requested resource was not found.', error);
    }
    
    if (errorObj.status >= 500) {
      return createStandardError('Server error. Please try again later.', error);
    }
  }
  
  return createStandardError(message, error);
};
