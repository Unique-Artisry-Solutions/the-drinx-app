
import { useEffect } from 'react';

// Add this to extend the Window interface with our custom property
declare global {
  interface Window {
    isLoading?: boolean;
  }
}

/**
 * Hook for handling immediate redirects after login
 * Uses localStorage consistently for all auth-related storage
 */
export const useImmediateRedirect = (pageId: string) => {
  useEffect(() => {
    // Log page load with timestamp
    const timestamp = new Date().toISOString();
    console.log(`[LOGIN PAGE ${pageId}] Page loaded at ${timestamp}`, {
      path: window.location.pathname,
      search: window.location.search,
    });

    // Log auth related storage flags
    console.log(`[LOGIN PAGE ${pageId}] Storage state:`, {
      // Auth state flags
      loginSuccess: localStorage.getItem('login_success'),
      loginTimestamp: localStorage.getItem('login_success_timestamp'),
      loginUserType: localStorage.getItem('login_user_type'),
      loginAttemptId: localStorage.getItem('login_attempt_id'),
      bypassAttemptId: localStorage.getItem('bypass_attempt_id'),
      
      // User state flags
      authenticated: localStorage.getItem('user_authenticated'),
      userType: localStorage.getItem('user_type'),
      adminBypass: localStorage.getItem('admin_bypass'),
      redirectPath: localStorage.getItem('auth_redirect')
    });
    
    // Check URL params for debugging
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug_auth') === 'true') {
      console.log(`[LOGIN PAGE ${pageId}] Auth debugging enabled`);
    }
    
    // Check if we need an immediate redirect
    const checkForImmediateRedirect = () => {
      try {
        // If just logged in as promoter (checked via localStorage)
        if (localStorage.getItem('login_success') === 'true' && 
            localStorage.getItem('login_user_type') === 'promoter') {
          console.log(`[LOGIN PAGE ${pageId}] Detected successful promoter login, redirecting immediately`);
          
          // Clear tracking flags 
          localStorage.removeItem('login_success');
          
          // Get redirect path or use default
          const savedRedirect = localStorage.getItem('auth_redirect') || '/promoter/dashboard';
          localStorage.removeItem('auth_redirect');
          
          // Create URL with timestamp
          const redirectUrl = new URL(savedRedirect, window.location.origin);
          redirectUrl.searchParams.set('redirect_ts', Date.now().toString());
          redirectUrl.searchParams.set('login_page_id', pageId);
          
          console.log(`[LOGIN PAGE ${pageId}] Redirecting to: ${redirectUrl.toString()}`);
          window.location.href = redirectUrl.toString();
          return true;
        }
        return false;
      } catch (err) {
        console.error(`[LOGIN PAGE ${pageId}] Error in redirect check:`, err);
        return false;
      }
    };
    
    // Run initial check but don't get stuck in redirect loops
    if (!window.location.href.includes('redirect_ts=')) {
      checkForImmediateRedirect();
    }
    
    // Also set up an interval to check for changes in localStorage
    // This helps catch async login completions, but with a limit to prevent loops
    let checkCount = 0;
    const maxChecks = 5; // Reduced from 10 to 5 to prevent excessive checks
    const intervalId = setInterval(() => {
      if (checkCount < maxChecks) {
        const didRedirect = checkForImmediateRedirect();
        checkCount++;
        
        // If we redirected or reached the max checks, clear the interval
        if (didRedirect || checkCount >= maxChecks) {
          clearInterval(intervalId);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 1500); // Increased from 1000ms to 1500ms to reduce frequency
    
    return () => {
      clearInterval(intervalId);
      console.log(`[LOGIN PAGE ${pageId}] Page unloaded at ${new Date().toISOString()}`);
    };
  }, [pageId]);
};
