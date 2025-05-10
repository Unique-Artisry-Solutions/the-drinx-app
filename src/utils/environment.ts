
/**
 * Environment utility functions
 */

import { format, isValid } from 'date-fns';

export const isPreviewEnvironment = (): boolean => {
  // Check if we're running in a preview environment
  return process.env.NODE_ENV === 'development' || window.location.hostname.includes('preview');
};

/**
 * Safely format a date string or Date object with a fallback for invalid dates
 * 
 * @param dateInput - The date to format (string, Date object, or null/undefined)
 * @param formatString - The date-fns format string to use (default: 'MMM d, yyyy')
 * @param fallback - What to return if the date is invalid (default: 'N/A')
 * @returns A formatted date string or the fallback value
 */
export const safeFormatDate = (
  dateInput: string | Date | null | undefined,
  formatString: string = 'MMM d, yyyy',
  fallback: string = 'N/A'
): string => {
  if (!dateInput) return fallback;
  
  try {
    const dateObject = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (!isValid(dateObject)) {
      return fallback;
    }
    
    return format(dateObject, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
};
