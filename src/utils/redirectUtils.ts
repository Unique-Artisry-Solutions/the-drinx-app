
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
  
  // Mark this redirect in localStorage with more robust tracking
  const currentTime = Date.now();
  localStorage.setItem('last_redirect_time', currentTime.toString());
  const redirectCount = parseInt(localStorage.getItem('redirect_count') || '0');
  localStorage.setItem('redirect_count', (redirectCount + 1).toString());
  
  // Store the last path to help identify loops
  const lastPath = localStorage.getItem('last_redirect_path') || '';
  localStorage.setItem('last_redirect_path', path);
  
  // Check for ping-pong redirects (back and forth between two pages)
  if (path === lastPath && redirectCount > 0) {
    console.error(`[REDIRECT UTIL] Ping-pong redirect detected (${path}), cancelling`);
    localStorage.removeItem('redirect_count');
    localStorage.removeItem('last_redirect_time');
    localStorage.removeItem('last_redirect_path');
    return;
  }
  
  const isPromoter = userType === 'promoter';
  
  // Create URL with tracking parameters
  const redirectUrl = new URL(path, window.location.origin);
  
  // Add standard tracking parameters
  redirectUrl.searchParams.set('redirect_ts', currentTime.toString());
  redirectUrl.searchParams.set('redirect_source', source);
  redirectUrl.searchParams.set('redirect_count', redirectCount.toString());
  
  // Add any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    redirectUrl.searchParams.set(key, value);
  });
  
  console.log(`[REDIRECT UTIL] Redirecting to: ${path} (Full refresh: ${isFullPageRefresh || isPromoter}, Source: ${source}, Count: ${redirectCount})`);
  
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
 * Enhanced redirect loop detection with multiple strategies
 * Returns true if a loop is detected
 */
export function isRedirectLoop(): boolean {
  // Check redirectCount threshold
  const redirectCount = parseInt(localStorage.getItem('redirect_count') || '0');
  if (redirectCount >= 3) {
    console.error('[REDIRECT UTIL] Too many redirects in succession, breaking cycle');
    return true;
  }
  
  // Check timing of redirects
  const lastRedirectTime = localStorage.getItem('last_redirect_time');
  const currentTime = Date.now();
  
  if (lastRedirectTime) {
    const timeSinceLastRedirect = currentTime - parseInt(lastRedirectTime);
    
    // If multiple redirects happen very quickly (less than 1 second apart)
    if (timeSinceLastRedirect < 1000 && redirectCount > 1) {
      console.error('[REDIRECT UTIL] Rapid redirects detected, breaking cycle');
      return true;
    }
  }
  
  // Check URL parameters for signs of loop
  const urlParams = new URLSearchParams(window.location.search);
  const paramRedirectCount = parseInt(urlParams.get('redirect_count') || '0');
  
  if (paramRedirectCount >= 3) {
    console.error('[REDIRECT UTIL] URL parameters indicate redirect loop, breaking cycle');
    return true;
  }
  
  // Check for ping-pong redirects in URL params
  const source = urlParams.get('redirect_source');
  const prevSource = localStorage.getItem('previous_redirect_source');
  
  if (source && prevSource && source !== prevSource && redirectCount > 1) {
    localStorage.setItem('previous_redirect_source', source);
    console.warn('[REDIRECT UTIL] Different redirect sources in quick succession, watching for loop');
    
    if (redirectCount >= 2) {
      console.error('[REDIRECT UTIL] Ping-pong redirect detected between different sources');
      return true;
    }
  } else if (source) {
    localStorage.setItem('previous_redirect_source', source);
  }
  
  return false;
}

/**
 * Function to explicitly break redirect loops
 * Cleans up all redirect-related storage
 */
export function breakRedirectLoop() {
  console.log('[REDIRECT UTIL] Manually breaking redirect loop');
  
  // Clear all redirect tracking
  localStorage.removeItem('redirect_count');
  localStorage.removeItem('last_redirect_time');
  localStorage.removeItem('last_redirect_path');
  localStorage.removeItem('previous_redirect_source');
  localStorage.removeItem('login_success');
  localStorage.removeItem('login_success_timestamp');
  localStorage.removeItem('login_user_type');
  localStorage.removeItem('login_redirect');
  localStorage.removeItem('auth_redirect');
  
  // Clear URL parameters
  if (window.history && window.history.replaceState) {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
  
  console.log('[REDIRECT UTIL] Redirect tracking has been reset');
  return true;
}
