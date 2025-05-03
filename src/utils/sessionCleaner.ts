
/**
 * Authentication storage utilities
 * This module provides functions to manage authentication-related storage
 * All auth data is consistently stored in localStorage for persistence
 */

/**
 * Clear login-related storage items
 */
export const clearLoginSessions = () => {
  // Clear login tracking flags from localStorage
  localStorage.removeItem('login_success');
  localStorage.removeItem('login_success_timestamp');
  localStorage.removeItem('login_user_type');
  localStorage.removeItem('login_attempt_id');
  localStorage.removeItem('login_attempt_timestamp');
  localStorage.removeItem('login_requested_usertype');
  localStorage.removeItem('login_redirect');
  localStorage.removeItem('promoter_login_redirect');
  
  console.log('[AUTH STORAGE] Cleared login-related storage data');
};

/**
 * Clear bypass-related storage items
 */
export const clearBypassSessions = () => {
  // Clear bypass tracking flags from localStorage
  localStorage.removeItem('bypass_login_timestamp');
  localStorage.removeItem('bypass_user_type');
  localStorage.removeItem('bypass_attempt_id');
  localStorage.removeItem('bypass_timestamp');
  
  console.log('[AUTH STORAGE] Cleared bypass-related storage data');
};

/**
 * Clear all authentication storage
 * This is a comprehensive reset of all auth-related storage
 */
export const clearAllSessions = () => {
  // Clear specific authentication data
  clearLoginSessions();
  clearBypassSessions();
  
  // Clear core authentication state
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_type');
  localStorage.removeItem('user_username');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_join_date');
  
  // Clear admin-related data
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_username');
  localStorage.removeItem('admin_session_created');
  localStorage.removeItem('admin_bypass');
  localStorage.removeItem('bypass_user_id');
  
  // Clear Supabase auth storage
  localStorage.removeItem('spiritless-auth-storage');
  
  // Clear auth_redirect which can cause redirect loops
  localStorage.removeItem('auth_redirect');
  
  console.log('[AUTH STORAGE] Performed complete authentication storage reset');
};

/**
 * Emergency reset of all browser storage (localStorage and sessionStorage)
 * Use this function only when troubleshooting severe authentication issues
 */
export const emergencyResetAllStorage = () => {
  // First clear all authentication-specific data
  clearAllSessions();
  
  // Then clear any remaining localStorage items
  localStorage.clear();
  
  // Also clear sessionStorage for completeness
  sessionStorage.clear();
  
  console.log('[AUTH STORAGE] EMERGENCY RESET: All browser storage has been cleared');
  
  return true; // Return success flag for UI feedback
};
