
/**
 * Checks if the app is running in the Lovable preview environment
 */
export const isPreviewEnvironment = (): boolean => {
  try {
    // Check for Lovable preview environment using safer detection methods
    const isInFrame = window !== window.parent;
    const isLovableDomain = 
      typeof window !== 'undefined' &&
      window.location &&
      (window.location.hostname.includes('lovable.dev') || 
       window.location.hostname.includes('lovable.app') ||
       window.location.hostname.includes('gptengineer.app'));
    
    // Some environments might have the Lovable script added
    const hasLovableScript = 
      typeof document !== 'undefined' && 
      document.querySelector && 
      document.querySelector('script[src*="gptengineer.js"]') !== null;
    
    return isInFrame || isLovableDomain || hasLovableScript;
  } catch (error) {
    // If we can't access window or document, assume we're in a preview environment
    console.log("Error checking environment, assuming preview:", error);
    return true;
  }
};

/**
 * Checks if we're running in a production environment
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production' && !isPreviewEnvironment();
};

/**
 * Checks if we're running in a development environment
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Safe check for browser APIs that might not exist in some environments
 * @param callback Function to execute if browser APIs are available
 * @returns The result of the callback or undefined
 */
export const safeBrowserApi = <T>(callback: () => T): T | undefined => {
  // Skip in preview environment
  if (isPreviewEnvironment()) {
    return undefined;
  }
  
  try {
    return callback();
  } catch (error) {
    console.error('Browser API error:', error);
    return undefined;
  }
};

/**
 * Safe date formatter to prevent errors with invalid dates
 * @param date Date to format or date string
 * @param formatStr Format string for date-fns
 * @param fallback Fallback string if date is invalid
 */
export const safeFormatDate = (
  date: Date | string | null | undefined, 
  formatStr: string = 'MMM d, yyyy',
  fallback: string = 'No date'
): string => {
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return fallback;
    
    // Import format dynamically to prevent SSR issues
    const { format } = require('date-fns');
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return fallback;
  }
};
