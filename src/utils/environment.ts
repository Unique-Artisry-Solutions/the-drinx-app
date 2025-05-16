
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
  
  // Specific checks for Lovable preview environments
  if (
    hostname.includes('lovableproject.com') ||
    hostname.includes('preview') ||
    hostname.includes('staging') ||
    hostname.includes('test') ||
    hostname.includes('localhost')
  ) {
    return true;
  }
  
  // Check URL parameters that might indicate preview mode
  if (window.location.search.includes('preview=true') || 
      window.location.search.includes('mode=preview')) {
    return true;
  }
  
  // Check local storage for preview flag that might have been set
  if (localStorage.getItem('preview_mode') === 'true') {
    return true;
  }
  
  return false;
};

/**
 * Format date safely for consistent display in preview and production environments
 * If the date is invalid, returns a placeholder
 * 
 * @param dateStr - Date string or Date object to format
 * @param formatOptions - Optional formatting options or format string from date-fns
 * @param fallback - Optional fallback string if date is invalid
 * @returns Formatted date string
 */
export const safeFormatDate = (
  dateStr: string | Date | undefined | null, 
  formatOptions?: Intl.DateTimeFormatOptions | string,
  fallback: string = 'N/A'
): string => {
  if (!dateStr) return fallback;
  
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return fallback || 'Invalid Date';
    }
    
    // Handle string format (for date-fns compatibility)
    if (typeof formatOptions === 'string') {
      // Return ISO string format, client code should use date-fns to format it
      return date.toISOString();
    }
    
    // Use Intl.DateTimeFormat for object format options
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
