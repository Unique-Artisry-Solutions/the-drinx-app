
/**
 * Environment utility functions
 */

export const isPreviewEnvironment = (): boolean => {
  // Check if we're running in a preview environment
  return process.env.NODE_ENV === 'development' || window.location.hostname.includes('preview');
};
