
/**
 * Utility for admin bypass functionality
 */

export interface AdminBypassResult {
  isEnabled: boolean;
  userType?: string | null;
}

/**
 * Check if admin bypass is enabled
 */
export const checkAdminBypassStatus = (): AdminBypassResult => {
  const bypassEnabled = localStorage.getItem('admin_bypass') === 'true';
  const bypassUserType = localStorage.getItem('bypass_user_type');
  
  // First check normal admin authentication
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  if (isAdminAuthenticated) {
    return {
      isEnabled: true,
      userType: 'admin'
    };
  }
  
  // Then check bypass mode
  return {
    isEnabled: bypassEnabled,
    userType: bypassUserType
  };
};

/**
 * Enable admin bypass mode
 */
export const enableAdminBypass = (userType: string): void => {
  localStorage.setItem('admin_bypass', 'true');
  localStorage.setItem('bypass_user_type', userType);
  
  // Dispatch event to notify components
  const event = new CustomEvent('adminBypassChanged', {
    detail: { enabled: true, userType }
  });
  window.dispatchEvent(event);
};

/**
 * Disable admin bypass mode
 */
export const disableAdminBypass = (): void => {
  localStorage.removeItem('admin_bypass');
  localStorage.removeItem('bypass_user_type');
  
  // Dispatch event to notify components
  const event = new CustomEvent('adminBypassChanged', {
    detail: { enabled: false }
  });
  window.dispatchEvent(event);
};

/**
 * Create a user object for bypass mode
 */
export const createBypassUser = () => {
  const bypassUserType = localStorage.getItem('bypass_user_type') || 'individual';
  
  return {
    id: 'bypass-user',
    email: 'bypass@example.com',
    user_metadata: {
      user_type: bypassUserType,
      name: 'Bypass User',
      username: 'bypassuser'
    }
  } as any;
};
