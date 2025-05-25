import { UserType } from '@/types/navigation';
import { NavigationType } from '@/components/navigation/NavigationTypes';

export interface EffectiveAuthState {
  userType: UserType | null;
  isAuthenticated: boolean;
  isUsingDevBypass: boolean;
  navigationType: NavigationType;
}

/**
 * Resolves the effective navigation state considering both real auth and dev bypass
 */
export const resolveNavigationState = (
  authUserType: UserType | null,
  authIsAuthenticated: boolean,
  devUserType: UserType | null,
  devIsAuthenticated: boolean,
  isUsingDevBypass: boolean,
  currentPath: string,
  forceGuestNavigation: boolean = false
): EffectiveAuthState => {
  console.log('NavigationResolver - Resolving state:', {
    authUserType,
    authIsAuthenticated,
    devUserType,
    devIsAuthenticated,
    isUsingDevBypass,
    currentPath,
    forceGuestNavigation
  });

  // Define public paths that always use guest navigation
  const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing'];
  const isPublicPath = publicPaths.includes(currentPath) || forceGuestNavigation;
  
  // Determine effective auth state
  let effectiveUserType: UserType | null;
  let effectiveIsAuthenticated: boolean;
  
  if (isUsingDevBypass) {
    effectiveUserType = devUserType;
    effectiveIsAuthenticated = devIsAuthenticated;
  } else {
    effectiveUserType = authUserType;
    effectiveIsAuthenticated = authIsAuthenticated;
  }
  
  // Determine navigation type
  let navigationType: NavigationType;
  
  if (effectiveUserType === 'admin' && effectiveIsAuthenticated) {
    navigationType = NavigationType.ADMIN;
  } else if (effectiveIsAuthenticated && !isPublicPath) {
    navigationType = NavigationType.USER;
  } else {
    navigationType = NavigationType.GUEST;
  }
  
  const result = {
    userType: effectiveUserType,
    isAuthenticated: effectiveIsAuthenticated,
    isUsingDevBypass,
    navigationType
  };
  
  console.log('NavigationResolver - Resolved state:', result);
  return result;
};

/**
 * Determines if guest navigation should be used
 */
export const shouldUseGuestNavigation = (
  isAuthenticated: boolean,
  currentPath: string,
  forceGuestNavigation: boolean = false
): boolean => {
  if (forceGuestNavigation) return true;
  
  // Always use guest navigation for non-authenticated users
  if (!isAuthenticated) return true;
  
  // For authenticated users, use guest navigation only on explicit public paths
  const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing'];
  return publicPaths.includes(currentPath);
};

/**
 * Gets the appropriate home path for a user type - Updated to match route configuration
 */
export const getHomePathForUserType = (userType: UserType | null): string => {
  if (!userType) return '/landing';
  
  switch (userType) {
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter/dashboard';
    case 'admin':
      return '/admin/system-breakdown'; // Fixed: system-breakdown is now the admin default
    case 'individual':
    default:
      return '/explore';
  }
};

/**
 * Converts admin user type to non-admin for components that don't handle admin
 */
export const toNonAdminUserType = (userType: UserType | null): 'individual' | 'establishment' | 'promoter' => {
  if (userType === 'admin') return 'individual';
  return userType || 'individual';
};
