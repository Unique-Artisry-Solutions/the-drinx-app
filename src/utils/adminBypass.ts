
import { v4 as uuidv4 } from 'uuid';

export function enableAdminBypass(userType: 'individual' | 'establishment' | 'admin' = 'individual') {
  const bypassUserId = uuidv4();
  
  localStorage.setItem('admin_bypass', 'true');
  localStorage.setItem('bypass_user_id', bypassUserId);
  localStorage.setItem('user_type', userType);
  localStorage.setItem('user_email', `admin-${userType}@spiritless.com`);
  localStorage.setItem('user_username', `admin-${userType}`);
  
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
