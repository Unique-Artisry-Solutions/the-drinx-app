
import { v4 as uuidv4 } from 'uuid';

export function enableAdminBypass(userType: 'individual' | 'establishment' | 'admin' | 'promoter' = 'individual') {
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
  return bypassUserId;
}

export function disableAdminBypass() {
  localStorage.removeItem('admin_bypass');
  localStorage.removeItem('bypass_user_id');
  
  // Don't remove user_type, user_email, and user_username as they might be used elsewhere
  console.log('Admin bypass disabled');
}

export function checkAdminBypassStatus() {
  const isEnabled = localStorage.getItem('admin_bypass') === 'true';
  const bypassUserId = localStorage.getItem('bypass_user_id');
  const userType = localStorage.getItem('user_type');
  
  if (isEnabled) {
    console.log(`Admin bypass is active with user ID: ${bypassUserId} and type: ${userType}`);
  } else {
    console.log('Admin bypass is not active');
  }
  
  return {
    isEnabled,
    bypassUserId,
    userType
  };
}

/**
 * Completely clears all session information from localStorage
 * Use this function to reset all authentication state for testing
 */
export function clearAllSessions() {
  // Clear all auth-related localStorage items
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_type');
  localStorage.removeItem('user_username');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_join_date');
  localStorage.removeItem('establishment_name');
  
  // Clear admin authentication
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_username');
  localStorage.removeItem('admin_session_created');
  
  // Clear admin bypass
  localStorage.removeItem('admin_bypass');
  localStorage.removeItem('bypass_user_id');
  
  // Clear Supabase session
  localStorage.removeItem('spiritless-auth-storage');
  
  console.log('All session information has been cleared');
  
  // Force a page reload to ensure clean state
  window.location.href = '/login';
}
