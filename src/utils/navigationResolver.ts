
import { UserType } from '@/types/navigation';
import { NavigationType } from '@/components/navigation/NavigationTypes';

export interface EffectiveAuthState {
  userType: UserType | null;
  isAuthenticated: boolean;
  navigationType: NavigationType;
}

/**
 * Simplified navigation state resolver that properly handles unauthenticated users
 */
export const resolveNavigationState = (
  userType: UserType | null,
  isAuthenticated: boolean,
  currentPath: string,
  forceGuestNavigation: boolean = false
): EffectiveAuthState => {
  // Public paths that always use guest navigation
  const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing', '/explore'];
  const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path));
  
  // Force guest navigation for unauthenticated users on public paths
  if (!isAuthenticated && (isPublicPath || forceGuestNavigation)) {
    return {
      userType: null,
      isAuthenticated: false,
      navigationType: NavigationType.GUEST
    };
  }
  
  // Determine navigation type for authenticated users
  let navigationType: NavigationType;
  
  if (userType === 'admin' && isAuthenticated && currentPath.startsWith('/admin')) {
    navigationType = NavigationType.ADMIN;
  } else if (isAuthenticated && userType && userType !== 'admin') {
    navigationType = NavigationType.USER;
  } else {
    navigationType = NavigationType.GUEST;
  }
  
  return {
    userType,
    isAuthenticated,
    navigationType
  };
};

/**
 * Gets the appropriate home path for a user type
 */
export const getHomePathForUserType = (userType: UserType | null): string => {
  switch (userType) {
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter/dashboard';
    case 'admin':
      return '/admin/system-breakdown';
    case 'individual':
      return '/explore';
    default:
      return '/landing';
  }
};

/**
 * Converts admin user type to individual for components that don't handle admin
 */
export const toNonAdminUserType = (userType: UserType | null): 'individual' | 'establishment' | 'promoter' => {
  if (userType === 'admin') return 'individual';
  return userType || 'individual';
};

/**
 * Determines if a path requires authentication
 */
export const requiresAuthentication = (path: string): boolean => {
  const protectedPaths = ['/admin', '/establishment', '/promoter', '/profile'];
  return protectedPaths.some(protectedPath => path.startsWith(protectedPath));
};

/**
 * Determines if a user can access a specific path
 */
export const canAccessPath = (
  path: string, 
  userType: UserType | null, 
  isAuthenticated: boolean
): boolean => {
  // Public paths are always accessible
  const publicPaths = ['/', '/landing', '/login', '/signup', '/explore', '/mission', '/pricing'];
  if (publicPaths.some(publicPath => path === publicPath || path.startsWith(publicPath))) {
    return true;
  }
  
  // Protected paths require authentication
  if (!isAuthenticated && requiresAuthentication(path)) {
    return false;
  }
  
  // User-type specific paths
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
