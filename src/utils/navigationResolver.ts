
import { UserType } from '@/types/navigation';
import { NavigationType } from '@/components/navigation/NavigationTypes';

export interface EffectiveAuthState {
  userType: UserType | null;
  isAuthenticated: boolean;
  navigationType: NavigationType;
}

/**
 * Simplified navigation state resolver
 */
export const resolveNavigationState = (
  userType: UserType | null,
  isAuthenticated: boolean,
  currentPath: string,
  forceGuestNavigation: boolean = false
): EffectiveAuthState => {
  // Public paths that always use guest navigation
  const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing'];
  const isPublicPath = publicPaths.includes(currentPath) || forceGuestNavigation;
  
  // Determine navigation type
  let navigationType: NavigationType;
  
  if (userType === 'admin' && isAuthenticated && currentPath.startsWith('/admin')) {
    navigationType = NavigationType.ADMIN;
  } else if (isAuthenticated && !isPublicPath && userType && userType !== 'admin') {
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
    default:
      return '/explore';
  }
};

/**
 * Converts admin user type to individual for components that don't handle admin
 */
export const toNonAdminUserType = (userType: UserType | null): 'individual' | 'establishment' | 'promoter' => {
  if (userType === 'admin') return 'individual';
  return userType || 'individual';
};
