
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
      // Reset the redirect tracking counters to break the loop
      localStorage.removeItem('redirect_count');
      localStorage.removeItem('last_redirect_time');
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
    
    // Check if we need an immediate redirect - but don't run if we're already in a post-login state
    const isPostLogin = window.location.search.includes('auth_success=true') || 
                        window.location.search.includes('redirect_ts=');
    
    if (isPostLogin) {
      console.log(`[LOGIN PAGE ${pageId}] Already in post-login state, skipping immediate redirect`);
      return;
    }
    
    const checkForImmediateRedirect = () => {
      try {
        // If just logged in as promoter (checked via localStorage)
        if (localStorage.getItem('login_success') === 'true' && 
            localStorage.getItem('login_user_type') === 'promoter') {
          console.log(`[LOGIN PAGE ${pageId}] Detected successful promoter login, redirecting immediately`);
          
          // Clear tracking flags 
          localStorage.removeItem('login_success');
          localStorage.removeItem('login_success_timestamp');
          localStorage.removeItem('login_user_type');
          
          // Get redirect path or use default
          const savedRedirect = localStorage.getItem('auth_redirect') || '/promoter/dashboard';
          localStorage.removeItem('auth_redirect');
          
          // Perform the redirect
          performRedirect(savedRedirect, navigate, {
            userType: 'promoter',
            isFullPageRefresh: true,
            source: `immediate_${pageId}`
          });
          
          return true;
        }
        return false;
      } catch (err) {
        console.error(`[LOGIN PAGE ${pageId}] Error in redirect check:`, err);
        return false;
      }
    };
    
    // Only run the initial redirect check once
    checkForImmediateRedirect();
    
    // We'll remove the interval checks to simplify the login flow
    return () => {
      console.log(`[LOGIN PAGE ${pageId}] Page unloaded at ${new Date().toISOString()}`);
    };
  }, [pageId, navigate]);
};
