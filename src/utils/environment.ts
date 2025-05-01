
/**
 * Environment detection utilities
 * These utilities help determine which environment the app is running in
 * and provide safe methods for environment-specific operations
 */

/**
 * Checks if the app is running in the Lovable preview environment
 * Uses multiple fallback strategies that don't depend on browser APIs
 */
export const isPreviewEnvironment = (): boolean => {
  // In server-side rendering or testing environments
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return true; // Safer to assume preview in non-browser contexts
  }
  
  try {
    // Primary method: Check for preview hostname patterns
    // This doesn't require DOM manipulation or complex window interactions
    if (
      window.location &&
      (window.location.hostname.includes('lovable.dev') || 
       window.location.hostname.includes('lovable.app') ||
       window.location.hostname.includes('gptengineer.app'))
    ) {
      return true;
    }
    
    // Secondary method: Check for iframe embedding
    // Most preview environments are in iframes, but avoid DOM calls
    if (window !== window.parent) {
      return true;
    }
    
    // Tertiary method: Check for staging or development environment patterns
    // This is lightweight and doesn't depend on DOM
    if (
      process.env.NODE_ENV !== 'production' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname.includes('staging') ||
      window.location.protocol === 'file:'
    ) {
      return true;
    }
    
    return false;
  } catch (error) {
    // If we can't determine environment due to errors, assume preview for safety
    console.debug("Error checking environment, assuming preview:", error);
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
 * Safe wrapper for browser APIs that might not be available in some environments
 * @param callback Function to execute if browser APIs are available
 * @returns The result of the callback or undefined
 */
export const safeBrowserApi = <T>(callback: () => T): T | undefined => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return undefined;
  }
  
  // Skip execution in preview environment
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
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid before formatting
    if (isNaN(dateObj.getTime())) return fallback;
    
    // Import format dynamically to prevent SSR issues
    // Using this pattern to avoid direct imports that might cause SSR issues
    const { format } = require('date-fns');
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return fallback;
  }
};
