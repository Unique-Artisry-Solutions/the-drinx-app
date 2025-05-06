
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { clearAllSessions } from './sessionCleaner';

/**
 * Creates and enables an admin bypass session
 * 
 * @param userType The type of user to bypass as
 * @returns The ID of the bypass user
 */
export function enableAdminBypass(userType: 'individual' | 'establishment' | 'admin' | 'promoter' = 'individual') {
  // Generate a proper UUID for the bypass user ID
  const bypassUserId = uuidv4();
  
  localStorage.setItem('admin_bypass', 'true');
  localStorage.setItem('bypass_user_id', bypassUserId);
  localStorage.setItem('user_type', userType);
  localStorage.setItem('user_authenticated', 'true'); // Ensure this is always set
  localStorage.setItem('user_email', `admin-${userType}@spiritless.com`);
  localStorage.setItem('user_username', `admin-${userType}`);
  
  // Set establishment name for establishment users
  if (userType === 'establishment') {
    localStorage.setItem('establishment_name', 'Bypass Establishment');
  }
  
  // Set promoter name for promoter users
  if (userType === 'promoter') {
    localStorage.setItem('promoter_name', 'Bypass Promoter');
  }
  
  // Set admin authentication flag if it's an admin bypass
  if (userType === 'admin') {
    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_username', 'Admin');
    localStorage.setItem('admin_session_created', new Date().toISOString());
  }
  
  console.log(`Admin bypass enabled for ${userType} with ID: ${bypassUserId}`);
  
  // Create a custom event to notify the app that the bypass is enabled
  window.dispatchEvent(new CustomEvent('adminBypassChanged', { 
    detail: { enabled: true, userType, userId: bypassUserId } 
  }));
  
  return bypassUserId;
}

/**
 * Disables the admin bypass mode and removes associated session data
 */
export function disableAdminBypass() {
  const wasEnabled = localStorage.getItem('admin_bypass') === 'true';
  
  localStorage.removeItem('admin_bypass');
  localStorage.removeItem('bypass_user_id');
  
  if (wasEnabled) {
    window.dispatchEvent(new CustomEvent('adminBypassChanged', { 
      detail: { enabled: false } 
    }));
  }
  
  console.log('Admin bypass disabled');
}

/**
 * Checks if admin bypass is currently enabled
 * 
 * @returns Status information about admin bypass
 */
export function checkAdminBypassStatus() {
  const isEnabled = localStorage.getItem('admin_bypass') === 'true';
  const bypassUserId = localStorage.getItem('bypass_user_id');
  const userType = localStorage.getItem('user_type');
  
  return {
    isEnabled,
    bypassUserId,
    userType
  };
}

/**
 * Creates a mock user object from bypass information
 * Can be used to simulate a user session
 * 
 * @returns A mock user object for the current bypass
 */
export function createBypassUser(): User | null {
  const { isEnabled, bypassUserId, userType } = checkAdminBypassStatus();
  
  if (!isEnabled || !bypassUserId) {
    return null;
  }
  
  const email = localStorage.getItem('user_email') || `admin-${userType}@spiritless.com`;
  const username = localStorage.getItem('user_username') || `admin-${userType}`;
  
  return {
    id: bypassUserId,
    email: email,
    user_metadata: {
      user_type: userType,
      username: username,
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User;
}

/**
 * Reset all authentication state and clear all sessions
 */
export function resetAuth() {
  // Force sign out from Supabase
  supabase.auth.signOut({ scope: 'global' }).catch(error => {
    console.error("Error signing out:", error);
  });
  
  // Clear all session information (including bypass)
  clearAllSessions();
  
  // Dispatch an event to notify of auth reset
  window.dispatchEvent(new CustomEvent('authReset'));
  
  console.log('Authentication fully reset');
}

/**
 * Performs a login redirection based on the user type
 * Works for both regular and bypass users
 * 
 * IMPORTANT: This function should only be used directly when React Router navigation is not available
 * Otherwise, use the useAppNavigation hook to navigate
 */
export function redirectAfterLogin() {
  const userType = localStorage.getItem('user_type');
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  const savedRedirect = localStorage.getItem('auth_redirect');
  
  // Clear the saved redirect as we're handling it now
  localStorage.removeItem('auth_redirect');
  
  // Log the navigation that will happen for debugging purposes
  console.log('Redirecting after login:', {
    userType,
    isAdminAuthenticated,
    savedRedirect
  });
  
  // This direct navigation approach should be avoided when possible,
  // but is kept for cases where the hook-based navigation is not available
  if (savedRedirect) {
    console.log(`Redirecting to saved path: ${savedRedirect}`);
    window.location.href = savedRedirect;
    return;
  }
  
  if (isAdminAuthenticated) {
    console.log("Redirecting to admin dashboard");
    window.location.href = '/admin/system-breakdown';
    return;
  }
  
  if (userType === 'establishment') {
    console.log("Redirecting to establishment dashboard");
    window.location.href = '/establishment/dashboard';
    return;
  } 
  
  if (userType === 'promoter') {
    console.log("Redirecting to promoter dashboard");
    window.location.href = '/promoter/dashboard';
    return;
  }
  
  // Default for individual or unspecified user type
  console.log("Redirecting to explore page");
  window.location.href = '/explore';
}

/**
 * Add event listener for auth state changes
 * Useful for components that need to react to auth changes
 * 
 * @param callback Function to call when auth state changes
 * @returns Cleanup function to remove the listener
 */
export function onAuthStateChange(callback: (event: CustomEvent) => void) {
  const handler = (event: Event) => {
    callback(event as CustomEvent);
  };
  
  window.addEventListener('adminBypassChanged', handler);
  window.addEventListener('authReset', handler);
  
  return () => {
    window.removeEventListener('adminBypassChanged', handler);
    window.addEventListener('authReset', handler);
  };
}
