
import { UserType } from '@/types/navigation';

/**
 * Simplified route protection logic
 */
export const isRouteProtected = (path: string): boolean => {
  const protectedPaths = ['/admin', '/establishment', '/promoter', '/profile'];
  return protectedPaths.some(protectedPath => path.startsWith(protectedPath));
};

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (
  path: string,
  userType: UserType | null,
  isAuthenticated: boolean
): boolean => {
  // Public routes are always accessible
  const publicPaths = ['/', '/landing', '/login', '/signup', '/explore', '/404'];
  if (publicPaths.some(publicPath => path === publicPath)) {
    return true;
  }

  // Protected routes require authentication
  if (isRouteProtected(path) && !isAuthenticated) {
    return false;
  }

  // Role-specific route checks
  if (path.startsWith('/admin') && userType !== 'admin') {
    return false;
  }
  
  if (path.startsWith('/establishment') && userType !== 'establishment') {
    return false;
  }
  
  if (path.startsWith('/promoter') && userType !== 'promoter') {
    return false;
  }

  return true;
};

/**
 * Get redirect path for unauthorized access
 */
export const getRedirectPath = (
  path: string,
  userType: UserType | null,
  isAuthenticated: boolean
): string => {
  if (!isAuthenticated && isRouteProtected(path)) {
    return '/login';
  }

  // Role-based redirects
  if (userType === 'admin') return '/admin/system-breakdown';
  if (userType === 'establishment') return '/establishment/dashboard';
  if (userType === 'promoter') return '/promoter/dashboard';
  if (userType === 'individual') return '/explore';
  
  return '/landing';
};
