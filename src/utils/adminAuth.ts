
/**
 * Utility functions for admin authentication
 * This keeps admin auth separate from the main Supabase auth
 * to prevent conflicts and simplify debugging
 */

/**
 * Check if user is authenticated as admin
 */
export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('admin_authenticated') === 'true';
};

/**
 * Set admin authentication status
 */
export const setAdminAuthenticated = (username?: string): void => {
  localStorage.setItem('admin_authenticated', 'true');
  localStorage.setItem('admin_session_created', new Date().toISOString());
  
  if (username) {
    localStorage.setItem('admin_username', username);
  }
};

/**
 * Clear admin authentication
 */
export const clearAdminAuthentication = (): void => {
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_username');
  localStorage.removeItem('admin_session_created');
};

/**
 * Get admin username if authenticated
 */
export const getAdminUsername = (): string | null => {
  return isAdminAuthenticated() ? localStorage.getItem('admin_username') : null;
};

/**
 * Check if admin session is expired (optional feature)
 * Returns true if session should be considered expired
 */
export const isAdminSessionExpired = (maxAgeHours = 24): boolean => {
  if (!isAdminAuthenticated()) return true;
  
  const sessionCreated = localStorage.getItem('admin_session_created');
  if (!sessionCreated) return true;
  
  const created = new Date(sessionCreated).getTime();
  const now = new Date().getTime();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  
  return now - created > maxAgeMs;
};
