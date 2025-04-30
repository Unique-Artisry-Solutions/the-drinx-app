
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
