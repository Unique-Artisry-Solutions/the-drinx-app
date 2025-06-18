
import { NavigationType } from '@/components/navigation/NavigationTypes';

export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

export interface NavigationState {
  navigationType: NavigationType;
  userType: UserType | null;
  isAuthenticated: boolean;
}

export const resolveNavigationState = (
  userType: UserType | null,
  isAuthenticated: boolean,
  pathname: string,
  forceGuestNavigation?: boolean
): NavigationState => {
  console.log('🧭 Navigation resolver:', { userType, isAuthenticated, pathname, forceGuestNavigation });

  // Force guest navigation overrides everything
  if (forceGuestNavigation) {
    return {
      navigationType: NavigationType.GUEST,
      userType: null,
      isAuthenticated: false
    };
  }

  // Admin routes always use admin navigation when authenticated
  if (pathname.startsWith('/admin')) {
    if (isAuthenticated && userType === 'admin') {
      return {
        navigationType: NavigationType.ADMIN,
        userType: 'admin',
        isAuthenticated: true
      };
    }
    // Non-admin users on admin routes get guest navigation
    return {
      navigationType: NavigationType.GUEST,
      userType: null,
      isAuthenticated: false
    };
  }

  // Landing page and auth pages always use guest navigation
  const guestPaths = ['/', '/landing', '/login', '/signup', '/verify-email', '/contact'];
  if (guestPaths.includes(pathname)) {
    return {
      navigationType: NavigationType.GUEST,
      userType: null,
      isAuthenticated: false
    };
  }

  // Authenticated users get user navigation
  if (isAuthenticated && userType) {
    return {
      navigationType: NavigationType.USER,
      userType,
      isAuthenticated: true
    };
  }

  // Default to guest navigation
  return {
    navigationType: NavigationType.GUEST,
    userType: null,
    isAuthenticated: false
  };
};

export const toNonAdminUserType = (userType: UserType | null): UserType | null => {
  return userType === 'admin' ? null : userType;
};
