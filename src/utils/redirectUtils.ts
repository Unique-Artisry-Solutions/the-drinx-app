
/**
 * Centralized redirect utilities for consistent navigation throughout the app
 */

import { NavigateFunction } from 'react-router-dom';

// Add a global resetTimer for consecutive redirects
let lastRedirectTime = 0;
const REDIRECT_COOLDOWN = 1500; // 1.5 seconds cooldown between redirects

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
  
  // Implement cooling period between redirects to prevent instant loops
  const now = Date.now();
  if (now - lastRedirectTime < REDIRECT_COOLDOWN) {
    console.warn(`[REDIRECT UTIL] Redirects happening too quickly, adding delay`);
    // Add a small delay before proceeding with this redirect
    setTimeout(() => {
      performDelayedRedirect(path, navigate, options);
    }, REDIRECT_COOLDOWN);
    return;
  }
  
  // Update the last redirect time
  lastRedirectTime = now;
  
  // Check for redirect loop before proceeding
  if (isRedirectLoop()) {
    console.error(`[REDIRECT UTIL] Redirect loop detected, cancelling redirect to ${path}`);
    // Force a full reset of redirect tracking to break any loops
    breakRedirectLoop();
    return;
  }
  
  // Mark this redirect in localStorage with more robust tracking
  localStorage.setItem('last_redirect_time', now.toString());
  const redirectCount = parseInt(localStorage.getItem('redirect_count') || '0');
  localStorage.setItem('redirect_count', (redirectCount + 1).toString());
  
  // Store the last path to help identify loops
  const lastPath = localStorage.getItem('last_redirect_path') || '';
  localStorage.setItem('last_redirect_path', path);
  
  // Check for ping-pong redirects (back and forth between two pages)
  if (path === lastPath && redirectCount > 0) {
    console.error(`[REDIRECT UTIL] Ping-pong redirect detected (${path}), cancelling`);
    breakRedirectLoop();
    return;
  }
  
  const isPromoter = userType === 'promoter';
  
  // Create URL with tracking parameters
  const redirectUrl = new URL(path, window.location.origin);
  
  // Add standard tracking parameters
  redirectUrl.searchParams.set('redirect_ts', now.toString());
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
  try {
    navigate(redirectUrl.toString());
  } catch (error) {
    console.error(`[REDIRECT UTIL] Navigation failed, falling back to location.href`, error);
    // Fallback to direct location change if navigate fails
    window.location.href = redirectUrl.toString();
  }
}

// Helper function for delayed redirects
function performDelayedRedirect(path: string, navigate: NavigateFunction, options: any) {
  console.log(`[REDIRECT UTIL] Executing delayed redirect to ${path}`);
  
  // Update the redirect timestamp before proceeding
  lastRedirectTime = Date.now();
  
  // Use the standard redirect logic
  const { userType, isFullPageRefresh = false, source = 'redirect-delayed', params = {} } = options;
  
  // Create URL with tracking parameters
  const redirectUrl = new URL(path, window.location.origin);
  
  // Add standard tracking parameters
  redirectUrl.searchParams.set('redirect_ts', lastRedirectTime.toString());
  redirectUrl.searchParams.set('redirect_source', source);
  redirectUrl.searchParams.set('redirect_delayed', 'true');
  
  // Add any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    redirectUrl.searchParams.set(key, value);
  });
  
  console.log(`[REDIRECT UTIL] Delayed redirect executing to: ${path}`);
  
  if (userType === 'promoter' || isFullPageRefresh) {
    window.location.href = redirectUrl.toString();
  } else {
    try {
      navigate(redirectUrl.toString());
    } catch (error) {
      // Fallback if navigate fails
      window.location.href = redirectUrl.toString();
    }
  }
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
  // Check redirectCount threshold - more strict limit
  const redirectCount = parseInt(localStorage.getItem('redirect_count') || '0');
  if (redirectCount >= 2) {
    console.error('[REDIRECT UTIL] Too many redirects in succession, breaking cycle');
    return true;
  }
  
  // Check timing of redirects
  const lastRedirectTime = localStorage.getItem('last_redirect_time');
  const currentTime = Date.now();
  
  if (lastRedirectTime) {
    const timeSinceLastRedirect = currentTime - parseInt(lastRedirectTime);
    
    // If redirects happen very quickly (less than 800ms apart)
    if (timeSinceLastRedirect < 800 && redirectCount > 0) {
      console.error('[REDIRECT UTIL] Rapid redirects detected, breaking cycle');
      return true;
    }
  }
  
  // Check URL parameters for signs of loop
  const urlParams = new URLSearchParams(window.location.search);
  const paramRedirectCount = parseInt(urlParams.get('redirect_count') || '0');
  
  if (paramRedirectCount >= 2) {
    console.error('[REDIRECT UTIL] URL parameters indicate redirect loop, breaking cycle');
    return true;
  }
  
  // Check for ping-pong redirects in URL params
  const source = urlParams.get('redirect_source');
  const prevSource = localStorage.getItem('previous_redirect_source');
  
  if (source && prevSource && source !== prevSource && redirectCount > 0) {
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

// New helper function to force navigation to the login page
export function forceLoginNavigation() {
  // First break any potential redirect loops
  breakRedirectLoop();
  
  // Clear auth states that might be causing issues
  localStorage.removeItem('spiritless-auth-storage');
  localStorage.removeItem('user_authenticated');
  
  // Reset the loading state flag
  window.isLoading = false;
  
  // Redirect using location.href for a clean reset
  console.log('[REDIRECT UTIL] Forcing navigation to login page');
  window.location.href = '/login?source=force_reset&ts=' + Date.now();
}

// New function to safely check authentication status
export function safeAuthCheck() {
  // Get the current path
  const currentPath = window.location.pathname;
  
  // If we're already on login page or index, no need to check
  if (currentPath === '/login' || currentPath === '/') {
    return;
  }
  
  // If we detect we're not authenticated but on a protected page
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true' ||
                          localStorage.getItem('admin_authenticated') === 'true' ||
                          localStorage.getItem('admin_bypass') === 'true';
                          
  if (!isAuthenticated) {
    console.log('[REDIRECT UTIL] Not authenticated but on protected page, redirecting to login');
    forceLoginNavigation();
  }
}
