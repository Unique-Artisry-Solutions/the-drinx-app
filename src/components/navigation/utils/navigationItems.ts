import { UserType, NavigationItem, NavigationConfig, BreadcrumbItem } from '@/types/navigation';
import { 
  guestNavItems, 
  individualNavItems, 
  establishmentNavItems, 
  promoterNavItems, 
  adminNavItems 
} from '@/config/navigation';

export interface EffectiveUserState {
  userType: UserType | null;
  isAuthenticated: boolean;
  isDevelopment: boolean;
  isDevModeActive: boolean;
}

export const resolveEffectiveUserType = (
  authUserType: UserType | null,
  authIsAuthenticated: boolean,
  devUserType: UserType | null,
  isDevelopment: boolean,
  isDevModeActive: boolean
): EffectiveUserState => {
  console.log('resolveEffectiveUserType called with:', {
    authUserType,
    authIsAuthenticated,
    devUserType,
    isDevelopment,
    isDevModeActive
  });

  // In development mode with dev mode active, use dev settings
  if (isDevelopment && isDevModeActive && devUserType) {
    return {
      userType: devUserType,
      isAuthenticated: true, // Dev mode implies authenticated state
      isDevelopment,
      isDevModeActive
    };
  }

  // Otherwise use auth state
  return {
    userType: authUserType,
    isAuthenticated: authIsAuthenticated,
    isDevelopment,
    isDevModeActive
  };
};

export const generateNavigationItems = (
  effectiveState: EffectiveUserState,
  config?: NavigationConfig
): NavigationItem[] => {
  console.log('generateNavigationItems called with:', effectiveState);
  
  // If custom nav items are provided in config, use them
  if (config?.customNavItems) {
    return config.customNavItems;
  }
  
  // If not authenticated and not in dev mode, show guest navigation
  if (!effectiveState.isAuthenticated) {
    return guestNavItems;
  }
  
  // Return navigation based on effective user type
  switch (effectiveState.userType) {
    case 'establishment':
      return establishmentNavItems;
    case 'promoter':
      return promoterNavItems;
    case 'admin':
      return adminNavItems;
    case 'individual':
    default:
      return individualNavItems;
  }
};

export const generateBreadcrumbs = (
  pathname: string,
  navigationItems: NavigationItem[]
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always include home if not on home page
  if (pathname !== '/' && pathname !== '/landing') {
    breadcrumbs.push({
      label: 'Home',
      href: '/'
    });
  }
  
  // Find matching navigation item
  const matchingItem = navigationItems.find(item => 
    pathname === item.path || pathname.startsWith(item.path + '/')
  );
  
  if (matchingItem && matchingItem.path !== '/') {
    breadcrumbs.push({
      label: matchingItem.label,
      href: matchingItem.path
    });
  }
  
  // Handle nested paths
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length > 1) {
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip if we already added this breadcrumb
      if (breadcrumbs.some(b => b.href === currentPath)) {
        return;
      }
      
      // Add segment as breadcrumb if it's not the last one
      if (index < pathSegments.length - 1) {
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath
        });
      }
    });
  }
  
  return breadcrumbs;
};

export const getActiveTab = (
  pathname: string,
  navigationItems: NavigationItem[]
): string | null => {
  const activeItem = navigationItems.find(item =>
    pathname === item.path || pathname.startsWith(item.path + '/')
  );
  
  return activeItem?.path || null;
};

export const shouldShowFeature = (
  featureKey: string,
  effectiveState: EffectiveUserState
): boolean => {
  // Basic feature access logic - can be expanded based on requirements
  if (!effectiveState.isAuthenticated) {
    return ['explore', 'home', 'landing'].includes(featureKey);
  }
  
  switch (effectiveState.userType) {
    case 'admin':
      return true; // Admin can access all features
    case 'establishment':
      return ['dashboard', 'events', 'profile', 'analytics'].includes(featureKey);
    case 'promoter':
      return ['dashboard', 'events', 'profile', 'analytics', 'promotion'].includes(featureKey);
    case 'individual':
    default:
      return ['explore', 'profile', 'notifications', 'favorites'].includes(featureKey);
  }
};
