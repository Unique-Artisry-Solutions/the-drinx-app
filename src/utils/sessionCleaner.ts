
// Utility to clear all session data
export const clearAllSessions = () => {
  // Clear user authentication related items
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_type');
  localStorage.removeItem('user_username');
  localStorage.removeItem('user_name');
  localStorage.removeItem('establishment_name');
  localStorage.removeItem('promoter_name');
  
  // Clear admin related items
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_username');
  localStorage.removeItem('admin_session_created');
  
  // Clear admin bypass
  localStorage.removeItem('admin_bypass');
  localStorage.removeItem('bypass_user_id');
  
  // Clear Supabase session
  localStorage.removeItem('spiritless-auth-storage');
  
  console.log('All session information has been cleared');
  
  // Redirect to landing page
  window.location.href = '/landing';
};
