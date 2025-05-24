
/**
 * Utility to clear all session-related data from localStorage
 * This helps ensure a clean state when logging out or switching accounts
 */
export const clearAllSessions = () => {
  console.log("Cleaning all session data from localStorage");
  
  // Auth-related items
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_type');
  localStorage.removeItem('user_username');
  localStorage.removeItem('auth_redirect');
  localStorage.removeItem('auth_intent');
  localStorage.removeItem('spiritless-auth-storage'); // Critical: Clear Supabase auth storage
  
  // Role-specific items
  localStorage.removeItem('establishment_name');
  localStorage.removeItem('promoter_name');
  
  // Admin items - they have their own logout flow
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_username');
  localStorage.removeItem('admin_session_created');
};
