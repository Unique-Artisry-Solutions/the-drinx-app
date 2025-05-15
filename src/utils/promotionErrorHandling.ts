
/**
 * Utility functions for handling promotion code errors
 */

import { toast } from "@/hooks/use-toast";

export interface PromotionError {
  message: string;
  details?: string;
  code?: string;
  field?: string;
}

export interface ValidationErrorResponse {
  valid: boolean;
  message?: string;
  errors?: PromotionError[];
}

/**
 * Handle promotion validation errors in a user-friendly way
 */
export function handlePromotionValidationError(
  error: unknown,
  options: {
    showToast?: boolean;
    toastTitle?: string;
    onError?: (error: PromotionError[]) => void;
  } = {}
): PromotionError[] {
  const errors: PromotionError[] = [];
  
  // Handle known error response structures
  if (error && typeof error === 'object' && 'valid' in error && error.valid === false) {
    const errorResponse = error as ValidationErrorResponse;
    
    if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
      // We already have formatted errors
      errors.push(...errorResponse.errors);
    } else if (errorResponse.message) {
      // Single error message
      errors.push({
        message: errorResponse.message,
        code: 'VALIDATION_ERROR'
      });
    }
  } else if (error instanceof Error) {
    // Regular JS Error object
    errors.push({
      message: error.message,
      code: 'UNEXPECTED_ERROR'
    });
  } else {
    // Unknown error format
    errors.push({
      message: 'An unexpected error occurred',
      details: error ? String(error) : undefined,
      code: 'UNKNOWN_ERROR'
    });
  }
  
  // Show toast notification if requested
  if (options.showToast && errors.length > 0) {
    toast({
      title: options.toastTitle || 'Promotion Code Error',
      description: errors[0].message,
      variant: 'destructive',
    });
  }
  
  // Call the onError handler if provided
  if (options.onError) {
    options.onError(errors);
  }
  
  return errors;
}

/**
 * Format a promotion code error for display
 */
export function formatPromotionError(error: PromotionError): string {
  if (error.details) {
    return `${error.message}: ${error.details}`;
  }
  return error.message;
}

/**
 * Get a user-friendly explanation for common promotion error codes
 */
export function getPromotionErrorHelp(errorCode?: string): string | null {
  switch (errorCode) {
    case 'CODE_EXPIRED':
      return 'This promotion has expired and is no longer valid. Please try a different code.';
    case 'INVALID_DAY':
      return 'This promotion is only valid on specific days of the week. Please check the promotion details.';
    case 'INVALID_TIME':
      return 'This promotion is only valid during specific hours. Please try again during the valid time period.';
    case 'MIN_PURCHASE_NOT_MET':
      return 'Your purchase does not meet the minimum required amount for this promotion.';
    case 'USAGE_LIMIT_REACHED':
      return 'This promotion has reached its usage limit and is no longer available.';
    case 'ESTABLISHMENT_MISMATCH':
      return 'This promotion code cannot be used at this establishment.';
    default:
      return null;
  }
}
