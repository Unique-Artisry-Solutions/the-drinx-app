
/**
 * Checks if the app is running in the Lovable preview environment
 */
export const isPreviewEnvironment = (): boolean => {
  // Check for Lovable preview environment markers
  const isLovablePreview = 
    window.location.host.includes('lovable.dev') || 
    window.location.host.includes('lovable.app') ||
    window.location.host.includes('gptengineer.app') ||
    document.querySelector('script[src*="gptengineer.js"]') !== null;
    
  return isLovablePreview;
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
