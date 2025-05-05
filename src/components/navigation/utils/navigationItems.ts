
import { NavigationType } from '../NavigationTypes';
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
) => {
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
  // Removing '/explore' from this list to ensure authenticated users see the user navigation
  const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
  
  // Special case for public paths - show guest navigation
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

  // Check for establishment or promoter user paths
  if (currentUserType === 'establishment' || currentUserType === 'promoter') {
    return getUserNavItems(currentUserType, getProfilePath);
  }
  
  // Use navigation type based on authentication state
  switch (type) {
    case NavigationType.ADMIN:
      return getAdminNavItems();
    case NavigationType.USER:
      return getUserNavItems(currentUserType, getProfilePath);
    default:
      return getGuestNavItems();
  }
};
