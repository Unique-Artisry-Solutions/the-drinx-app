
/**
 * Utility functions to check environment conditions
 */

/**
 * Determines if the current environment is a preview environment
 * This can be used for showing sample data, enabling mock features, etc.
 */
export const isPreviewEnvironment = (): boolean => {
  // Check if we're in a development environment
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // Check for preview hostnames
  const hostname = window.location.hostname;
  if (
    hostname.includes('preview') ||
    hostname.includes('staging') ||
    hostname.includes('test') ||
    hostname.includes('localhost')
  ) {
    return true;
  }
  
  return false;
};

/**
 * Format date safely for consistent display in preview and production environments
 * If the date is invalid, returns a placeholder
 * 
 * @param dateStr - Date string or Date object to format
 * @param formatOptions - Optional formatting options
 * @param fallback - Optional fallback string if date is invalid
 * @returns Formatted date string
 */
export const safeFormatDate = (
  dateStr: string | Date | undefined | null, 
  formatOptions?: Intl.DateTimeFormatOptions,
  fallback: string = 'N/A'
): string => {
  if (!dateStr) return fallback;
  
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return fallback || 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat('en-US', formatOptions || {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return fallback || 'Error';
  }
};
