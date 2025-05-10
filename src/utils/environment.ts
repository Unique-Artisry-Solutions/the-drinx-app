
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
