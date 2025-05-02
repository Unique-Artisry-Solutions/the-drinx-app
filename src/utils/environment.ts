
/**
 * Checks if the current environment is a preview environment
 * 
 * @returns {boolean} True if running in the preview environment
 */
export const isPreviewEnvironment = (): boolean => {
  // Check for Lovable preview environment
  const isLovablePreview = 
    window.location.hostname.includes('lovable.app') || 
    window.location.hostname.includes('preview') ||
    window.location.hostname.includes('preview-app');
  
  return isLovablePreview;
};

/**
 * Checks if the app is running in development mode
 * 
 * @returns {boolean} True if in development mode
 */
export const isDevelopmentEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost';
};
