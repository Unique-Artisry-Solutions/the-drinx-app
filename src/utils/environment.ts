
/**
 * Comprehensive utility functions for environment detection
 */

// Check if window is available (for SSR safety)
const hasWindow = typeof window !== 'undefined';

/**
 * Detects if the app is running in the Lovable preview environment using multiple checks
 * 
 * @returns boolean True if running in Lovable preview
 */
export function isLovablePreview(): boolean {
  if (!hasWindow) return false;
  
  try {
    // Primary check: Look for the dedicated meta tag we added to index.html
    if (document.querySelector('meta[name="lovable-preview"]') !== null) {
      console.log('✓ Lovable preview detected via meta tag');
      return true;
    }
    
    // Secondary check: Iframe detection (Lovable preview runs in iframe)
    if (window !== window.parent) {
      console.log('✓ Lovable preview detected via iframe check');
      return true;
    }
    
    // Tertiary check: URL patterns specific to Lovable
    if (window.location.hostname.includes('lovable')) {
      console.log('✓ Lovable preview detected via hostname');
      return true;
    }
    
    // Additional check: Special window property
    if ('LovablePreview' in window) {
      console.log('✓ Lovable preview detected via window property');
      return true;
    }
    
    return false;
  } catch (e) {
    // If accessing window.parent throws security errors, we're likely in cross-origin iframe
    // Safer to assume it's a preview in this case
    console.log('⚠️ Error during environment detection, assuming Lovable preview:', e);
    return true;
  }
}

/**
 * Get environment name for logging and debugging
 */
export function getEnvironmentName(): string {
  return isLovablePreview() ? 'Lovable Preview' : 'Production/Development';
}

/**
 * For debug logging in preview mode
 */
export function previewLog(message: string, data?: any): void {
  if (isLovablePreview()) {
    if (data) {
      console.log(`[Preview] ${message}`, data);
    } else {
      console.log(`[Preview] ${message}`);
    }
  }
}
