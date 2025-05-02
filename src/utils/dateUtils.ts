
import { format } from 'date-fns';

/**
 * Safely formats a date with error handling
 * 
 * @param date - Date string or Date object
 * @param formatPattern - Format pattern for date-fns
 * @param fallback - Fallback string if date is invalid
 * @returns Formatted date string or fallback
 */
export const safeFormatDate = (
  date: string | Date | null | undefined,
  formatPattern: string = 'yyyy-MM-dd',
  fallback: string = 'N/A'
): string => {
  if (!date) return fallback;
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObject.getTime())) {
      return fallback;
    }
    
    return format(dateObject, formatPattern);
  } catch (error) {
    console.error(`Error formatting date: ${date}`, error);
    return fallback;
  }
};
