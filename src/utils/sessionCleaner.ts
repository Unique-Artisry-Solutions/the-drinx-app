
/**
 * Emergency utility to clear all authentication-related storage
 * Used to recover from authentication issues
 */

export function emergencyResetAllStorage() {
  console.log('[SESSION CLEANER] Starting emergency storage reset');
  try {
    // Clear authentication related localStorage items
    const authKeys = [
      'user_authenticated', 'user_email', 'user_type', 'user_username', 'user_name', 
      'user_join_date', 'admin_authenticated', 'admin_username', 'admin_session_created', 
      'admin_bypass', 'bypass_user_id', 'spiritless-auth-storage', 'login_success', 
      'login_success_timestamp', 'login_user_type', 'login_attempt_id', 'login_attempt_timestamp',
      'login_requested_usertype', 'auth_redirect', 'login_redirect', 'redirect_count',
      'last_redirect_time'
    ];
    
    authKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        console.log(`[SESSION CLEANER] Removing localStorage item: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear any session storage as well
    sessionStorage.clear();
    
    console.log('[SESSION CLEANER] Storage reset complete');
    return {
      success: true,
      message: 'Authentication storage has been successfully reset.'
    };
  } catch (error) {
    console.error('[SESSION CLEANER] Error during reset:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred during reset'
    };
  }
}

/**
 * Function to specifically break out of redirect loops
 */
export function breakRedirectLoop() {
  console.log('[SESSION CLEANER] Breaking redirect loop');
  try {
    // Remove redirect tracking
    localStorage.removeItem('redirect_count');
    localStorage.removeItem('last_redirect_time');
    localStorage.removeItem('login_success');
    localStorage.removeItem('login_success_timestamp');
    localStorage.removeItem('login_user_type');
    localStorage.removeItem('auth_redirect');
    localStorage.removeItem('login_redirect');
    
    // Clear URL parameters
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    return true;
  } catch (error) {
    console.error('[SESSION CLEANER] Error breaking redirect loop:', error);
    return false;
  }
}

/**
 * Alias for emergencyResetAllStorage for more intuitive naming
 * Used primarily by the landing page to clean up sessions
 */
export function clearAllSessions() {
  console.log('[SESSION CLEANER] Clearing all sessions via alias function');
  return emergencyResetAllStorage();
}

