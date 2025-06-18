import { UserType } from '@/types/navigation';
import { NavigationType } from '@/components/navigation/NavigationTypes';

export interface EffectiveAuthState {
  userType: UserType | null;
  isAuthenticated: boolean;
  navigationType: NavigationType;
}

/**
 * Simplified navigation state resolver that properly handles authenticated users
 */
export const resolveNavigationState = (
  userType: UserType | null,
  isAuthenticated: boolean,
  currentPath: string,
  forceGuestNavigation: boolean = false
): EffectiveAuthState => {
  console.log('Navigation resolver input:', { userType, isAuthenticated, currentPath, forceGuestNavigation });
  
  // If guest navigation is forced, always return guest
  if (forceGuestNavigation) {
    console.log('Forcing guest navigation');
    return {
      userType: null,
      isAuthenticated: false,
      navigationType: NavigationType.GUEST
    };
  }
  
  // For unauthenticated users, always use guest navigation
  if (!isAuthenticated) {
    console.log('User not authenticated, using guest navigation');
    return {
      userType: null,
      isAuthenticated: false,
      navigationType: NavigationType.GUEST
    };
  }
  
  // For authenticated users, determine navigation type based on user type and path
  let navigationType: NavigationType;
  
  if (userType === 'admin' && currentPath.startsWith('/admin')) {
    navigationType = NavigationType.ADMIN;
    console.log('Using admin navigation for admin user on admin path');
  } else if (isAuthenticated && userType) {
    // For any authenticated user with a user type, use user navigation
    navigationType = NavigationType.USER;
    console.log('Using user navigation for authenticated user:', userType);
  } else {
    navigationType = NavigationType.GUEST;
    console.log('Falling back to guest navigation');
  }
  
  const result = {
    userType,
    isAuthenticated,
    navigationType
  };
  
  console.log('Navigation resolver result:', result);
  return result;
};

/**
 * Gets the appropriate home path for a user type
 */
export const getHomePathForUserType = (userType: UserType | null): string => {
  console.log('getHomePathForUserType - Input userType:', userType);
  
  let homePath: string;
  
  switch (userType) {
    case 'establishment':
      homePath = '/establishment/dashboard';
      break;
    case 'promoter':
      homePath = '/promoter/dashboard';
      break;
    case 'admin':
      homePath = '/admin/system-breakdown';
      break;
    case 'individual':
      homePath = '/explore';
      break;
    default:
      homePath = '/landing';
  }
  
  console.log('getHomePathForUserType - Returning homePath:', homePath);
  return homePath;
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
