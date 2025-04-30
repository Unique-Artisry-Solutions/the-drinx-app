
/**
 * Utility functions for environment detection
 */

/**
 * Detects if the app is running in the Lovable preview environment
 * 
 * @returns boolean True if running in Lovable preview
 */
export function isLovablePreview(): boolean {
  try {
    // Check for specific meta tag added to index.html
    if (document.querySelector('meta[name="lovable-preview"]') !== null) {
      console.log('Detected Lovable preview via meta tag');
      return true;
    }
    
    // Check if we're in an iframe (Lovable preview uses iframe)
    if (window !== window.parent) {
      console.log('Detected Lovable preview via iframe check');
      return true;
    }
    
    // Check for specific URL patterns of Lovable
    if (window.location.hostname.includes('lovable')) {
      console.log('Detected Lovable preview via hostname');
      return true;
    }
    
    // Check if window has specific Lovable properties
    if ('LovablePreview' in window) {
      console.log('Detected Lovable preview via window property');
      return true;
    }
    
    return false;
  } catch (e) {
    // If accessing window.parent throws a security error, we're likely in a cross-origin iframe
    console.log('Error during environment detection, assuming Lovable preview for safety:', e);
    return true;
  }
}
