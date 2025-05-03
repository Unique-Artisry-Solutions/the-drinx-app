
/**
 * Centralized redirect utilities for consistent navigation throughout the app
 */

import { NavigateFunction } from 'react-router-dom';

/**
 * Standard redirect function to ensure consistent navigation behavior
 * Uses direct window.location for promoters and React Router for others
 */
export function performRedirect(
  path: string,
  navigate: NavigateFunction,
  options: {
    userType?: string;
    isFullPageRefresh?: boolean;
    source?: string;
    params?: Record<string, string>;
  } = {}
) {
  const { userType, isFullPageRefresh = false, source = 'redirect', params = {} } = options;
  const isPromoter = userType === 'promoter';
  
  // Create URL with tracking parameters
  const redirectUrl = new URL(path, window.location.origin);
  
  // Add standard tracking parameters
  redirectUrl.searchParams.set('redirect_ts', Date.now().toString());
  redirectUrl.searchParams.set('redirect_source', source);
  
  // Add any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    redirectUrl.searchParams.set(key, value);
  });
  
  console.log(`[REDIRECT UTIL] Redirecting to: ${path} (Full refresh: ${isFullPageRefresh || isPromoter})`);
  
  // Promoters always get full page refresh for consistent state handling
  if (isPromoter || isFullPageRefresh) {
    // Small timeout to allow state updates to complete
    setTimeout(() => {
      window.location.href = redirectUrl.toString();
    }, 50);
    return;
  }
  
  // For regular users, use React Router navigation
  navigate(path);
}

/**
 * Handle auth redirects specifically with standardized behavior
 */
export function handleAuthRedirect(
  user: any,
  navigate: NavigateFunction,
  options: {
    savedRedirect?: string | null;
    userType?: string;
    source?: string;
  } = {}
) {
  const { savedRedirect, userType, source = 'auth' } = options;
  
  if (!user) {
    console.warn('[REDIRECT UTIL] Attempted auth redirect without user');
    return;
  }

  // Clear any stored redirects to prevent loops
  localStorage.removeItem('auth_redirect');
  localStorage.removeItem('login_redirect');
  
  // Default paths based on user type
  let redirectPath = '/explore'; // Default for individual users
  
  if (userType === 'promoter') {
    redirectPath = '/promoter/dashboard';
  } else if (userType === 'establishment') {
    redirectPath = '/establishment/dashboard';
  } else if (userType === 'admin') {
    redirectPath = '/admin/system-breakdown';
  }
  
  // Use saved redirect if available
  if (savedRedirect) {
    redirectPath = savedRedirect;
  }
  
  // Perform the redirect with appropriate options
  performRedirect(redirectPath, navigate, {
    userType,
    source,
    params: { auth_success: 'true' }
  });
}

/**
 * Detect potential redirect loops
 * Returns true if a loop is detected
 */
export function isRedirectLoop(): boolean {
  // Check URL parameters for signs of recent redirects
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTimestamp = urlParams.get('redirect_ts');
  const authSuccess = urlParams.get('auth_success');
  const loginTs = urlParams.get('login_ts');
  const authTs = urlParams.get('auth_ts');
  
  // If we have multiple redirect parameters, potential loop
  const redirectParams = [redirectTimestamp, authSuccess, loginTs, authTs].filter(Boolean);
  
  if (redirectParams.length > 1) {
    console.warn('[REDIRECT UTIL] Potential redirect loop detected');
    return true;
  }
  
  // Check if we've redirected too many times in a short period
  const lastRedirectTime = localStorage.getItem('last_redirect_time');
  const currentTime = Date.now();
  
  if (lastRedirectTime && (currentTime - parseInt(lastRedirectTime)) < 2000) {
    console.warn('[REDIRECT UTIL] Multiple redirects in short timeframe, potential loop');
    localStorage.setItem('redirect_count', 
      (parseInt(localStorage.getItem('redirect_count') || '0') + 1).toString());
    
    if (parseInt(localStorage.getItem('redirect_count') || '0') > 3) {
      console.error('[REDIRECT UTIL] Redirect loop detected, breaking cycle');
      localStorage.setItem('redirect_count', '0');
      return true;
    }
  } else {
    localStorage.setItem('last_redirect_time', currentTime.toString());
    localStorage.setItem('redirect_count', '1');
  }
  
  return false;
}
