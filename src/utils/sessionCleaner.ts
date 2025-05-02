
/**
 * Utility to clear login-related session storage items
 */
export const clearLoginSessions = () => {
  // Clear login tracking flags
  sessionStorage.removeItem('login_success');
  sessionStorage.removeItem('login_success_timestamp');
  sessionStorage.removeItem('login_user_type');
  sessionStorage.removeItem('login_attempt_id');
  sessionStorage.removeItem('login_attempt_timestamp');
  sessionStorage.removeItem('login_requested_usertype');
  sessionStorage.removeItem('login_redirect');
  sessionStorage.removeItem('promoter_login_redirect');
  
  console.log('[SESSION CLEANER] Cleared login session data');
};

/**
 * Utility to clear bypass-related session storage items
 */
export const clearBypassSessions = () => {
  // Clear bypass tracking flags
  sessionStorage.removeItem('bypass_login_timestamp');
  sessionStorage.removeItem('bypass_user_type');
  sessionStorage.removeItem('bypass_attempt_id');
  sessionStorage.removeItem('bypass_timestamp');
  
  console.log('[SESSION CLEANER] Cleared bypass session data');
};

/**
 * Utility to clear all session storage items
 */
export const clearAllSessions = () => {
  clearLoginSessions();
  clearBypassSessions();
  
  // Clear any other session-specific items
  const keysToPreserve: string[] = [];
  
  // Loop through all sessionStorage items
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && !keysToPreserve.includes(key)) {
      sessionStorage.removeItem(key);
    }
  }
  
  console.log('[SESSION CLEANER] Cleared all session data');
};
