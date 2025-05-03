
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { performRedirect, isRedirectLoop } from '@/utils/redirectUtils';

/**
 * Hook for handling immediate redirects after login
 * Uses localStorage consistently for all auth-related storage
 */
export const useImmediateRedirect = (pageId: string) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log page load with timestamp
    const timestamp = new Date().toISOString();
    console.log(`[LOGIN PAGE ${pageId}] Page loaded at ${timestamp}`, {
      path: window.location.pathname,
      search: window.location.search,
    });

    // Check for redirect loop prevention
    if (isRedirectLoop()) {
      console.log(`[LOGIN PAGE ${pageId}] Detected redirect loop, skipping immediate redirect`);
      return;
    }
    
    // Log auth related storage flags
    console.log(`[LOGIN PAGE ${pageId}] Storage state:`, {
      // Auth state flags
      loginSuccess: localStorage.getItem('login_success'),
      loginTimestamp: localStorage.getItem('login_success_timestamp'),
      loginUserType: localStorage.getItem('login_user_type'),
      
      // User state flags
      authenticated: localStorage.getItem('user_authenticated'),
      userType: localStorage.getItem('user_type'),
      adminBypass: localStorage.getItem('admin_bypass'),
      redirectPath: localStorage.getItem('auth_redirect')
    });
    
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
          
          // Perform the redirect
          performRedirect(savedRedirect, navigate, {
            userType: 'promoter',
            isFullPageRefresh: true,
            source: `immediate_${pageId}`,
            params: {
              login_page_id: pageId
            }
          });
          
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
    
    // Set up an interval to check for changes in localStorage but with safeguards
    let checkCount = 0;
    const maxChecks = 3; // Reduced from 5 to 3 to minimize polling
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
    }, 2000); // Increased from 1500ms to 2000ms to reduce frequency further
    
    return () => {
      clearInterval(intervalId);
      console.log(`[LOGIN PAGE ${pageId}] Page unloaded at ${new Date().toISOString()}`);
    };
  }, [pageId, navigate]);
};
