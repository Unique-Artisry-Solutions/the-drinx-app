
import { NavigationType } from '@/types/navigation/NavigationTypes';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { getGuestNavItems, getCartGuestNavItems } from '../mobile/GuestNavItems';
import { getUserNavItems } from '../mobile/UserNavItems';
import { getAdminNavItems } from '../mobile/AdminNavItems';

export const getNavItems = (
  type: NavigationType,
  currentUserType: 'individual' | 'establishment' | 'promoter',
  forceGuestNavigation: boolean,
  user: any,
  location: { pathname: string },
  getProfilePath: () => string
): UnifiedNavItem[] => {
  // Check for admin login page first
  if (location.pathname === '/admin' || location.pathname === '/admin/login') {
    return getGuestNavItems();
  }
  
  // If forceGuestNavigation is true, always show guest navigation
  if (forceGuestNavigation) {
    return getGuestNavItems();
  }
  
  // If user is not authenticated, always show guest navigation
  if (!user) {
    return getGuestNavItems();
  }
  
  // Define public paths that should always show guest navigation
  const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
  
  // Special case for public paths - show guest navigation even if authenticated
  if (publicPaths.includes(location.pathname)) {
    return getGuestNavItems();
  }
  
  // Special case for cart page
  if (location.pathname === '/cart') {
    return getCartGuestNavItems();
  }

  // Check for admin routes
  if (location.pathname.startsWith('/admin/')) {
    return getAdminNavItems();
  }

  // For authenticated users, show user navigation based on their type
  if (user) {
    return getUserNavItems(currentUserType, getProfilePath);
  }
  
  // Default fallback to guest navigation
  return getGuestNavItems();
};
