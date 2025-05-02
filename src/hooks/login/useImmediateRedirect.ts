
import { useEffect } from 'react';

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
      // Session storage flags
      loginSuccess: sessionStorage.getItem('login_success'),
      loginTimestamp: sessionStorage.getItem('login_success_timestamp'),
      loginUserType: sessionStorage.getItem('login_user_type'),
      loginAttemptId: sessionStorage.getItem('login_attempt_id'),
      bypassAttemptId: sessionStorage.getItem('bypass_attempt_id'),
      
      // Local storage flags
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
      // If just logged in as promoter (checked via sessionStorage)
      if (sessionStorage.getItem('login_success') === 'true' && 
          sessionStorage.getItem('login_user_type') === 'promoter' && 
          !window.isLoading) {
        console.log(`[LOGIN PAGE ${pageId}] Detected successful promoter login, redirecting immediately`);
        
        // Clear tracking flags 
        sessionStorage.removeItem('login_success');
        
        // Get redirect path or use default
        const savedRedirect = localStorage.getItem('auth_redirect') || '/promoter/dashboard';
        localStorage.removeItem('auth_redirect');
        
        // Create URL with timestamp
        const redirectUrl = new URL(savedRedirect, window.location.origin);
        redirectUrl.searchParams.set('redirect_ts', Date.now().toString());
        redirectUrl.searchParams.set('login_page_id', pageId);
        
        console.log(`[LOGIN PAGE ${pageId}] Redirecting to: ${redirectUrl.toString()}`);
        window.location.href = redirectUrl.toString();
        return;
      }
    };
    
    // Run initial check
    checkForImmediateRedirect();
    
    // Also set up an interval to check for changes in session storage
    // This helps catch async login completions
    const intervalId = setInterval(checkForImmediateRedirect, 500);
    
    return () => {
      clearInterval(intervalId);
      console.log(`[LOGIN PAGE ${pageId}] Page unloaded at ${new Date().toISOString()}`);
    };
  }, [pageId]);
};
