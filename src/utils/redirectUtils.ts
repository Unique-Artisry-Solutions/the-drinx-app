
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
  
  // Prevent redirecting to the same page
  if (path === window.location.pathname) {
    console.log(`[REDIRECT UTIL] Skipping redirect - already on ${path}`);
    return;
  }
  
  // Check for redirect loop before proceeding
  if (isRedirectLoop()) {
    console.error(`[REDIRECT UTIL] Redirect loop detected, cancelling redirect to ${path}`);
    // Force a full reset of redirect tracking to break any loops
    localStorage.removeItem('redirect_count');
    localStorage.removeItem('last_redirect_time');
    localStorage.removeItem('login_success');
    localStorage.removeItem('login_success_timestamp');
    localStorage.removeItem('login_user_type');
    localStorage.removeItem('auth_redirect');
    localStorage.removeItem('login_redirect');
    console.warn('[REDIRECT UTIL] All redirect tracking has been reset to break potential loops');
    return;
  }
  
  // Mark this redirect in localStorage
  const currentTime = Date.now();
  localStorage.setItem('last_redirect_time', currentTime.toString());
  const redirectCount = parseInt(localStorage.getItem('redirect_count') || '0');
  localStorage.setItem('redirect_count', (redirectCount + 1).toString());
  
  const isPromoter = userType === 'promoter';
  
  // Create URL with tracking parameters
  const redirectUrl = new URL(path, window.location.origin);
  
  // Add standard tracking parameters
  redirectUrl.searchParams.set('redirect_ts', currentTime.toString());
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
  navigate(redirectUrl.toString());
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
  localStorage.removeItem('login_success');
  localStorage.removeItem('login_success_timestamp');
  localStorage.removeItem('login_user_type');
  
  // Reset redirect counter to prevent false positives
  localStorage.setItem('redirect_count', '0');
  
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
  
  // Check if we've redirected too many times in a short period
  const lastRedirectTime = localStorage.getItem('last_redirect_time');
  const currentTime = Date.now();
  const redirectCount = parseInt(localStorage.getItem('redirect_count') || '0');
  
  // More aggressive loop detection: if redirect count exceeds threshold, it's a loop
  if (redirectCount >= 2) {
    console.error('[REDIRECT UTIL] Too many redirects in succession, breaking cycle');
    return true;
  }
  
  if (lastRedirectTime && (currentTime - parseInt(lastRedirectTime)) < 2000) {
    console.warn('[REDIRECT UTIL] Multiple redirects in short timeframe, potential loop');
    
    if (redirectCount > 1) {
      console.error('[REDIRECT UTIL] Redirect loop detected, breaking cycle');
      return true;
    }
  }
  
  return false;
}
