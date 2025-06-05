
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
  // In development mode with dev mode active, use dev settings
  if (isDevelopment && isDevModeActive && devUserType) {
    return {
      userType: devUserType,
      isAuthenticated: true,
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
  if (config?.customNavItems) {
    return config.customNavItems;
  }
  
  if (!effectiveState.isAuthenticated) {
    return guestNavItems.map(item => ({
      label: item.label,
      path: item.path,
      icon: typeof item.icon === 'string' ? item.icon : item.icon?.name || 'default'
    }));
  }
  
  switch (effectiveState.userType) {
    case 'establishment':
      return establishmentNavItems.map(item => ({
        label: item.label,
        path: item.path,
        icon: typeof item.icon === 'string' ? item.icon : item.icon?.name || 'default'
      }));
    case 'promoter':
      return promoterNavItems.map(item => ({
        label: item.label,
        path: item.path,
        icon: typeof item.icon === 'string' ? item.icon : item.icon?.name || 'default'
      }));
    case 'admin':
      return adminNavItems.map(item => ({
        label: item.label,
        path: item.path,
        icon: typeof item.icon === 'string' ? item.icon : item.icon?.name || 'default'
      }));
    case 'individual':
    default:
      return individualNavItems.map(item => ({
        label: item.label,
        path: item.path,
        icon: typeof item.icon === 'string' ? item.icon : item.icon?.name || 'default'
      }));
  }
};

export const generateBreadcrumbs = (
  pathname: string,
  navigationItems: NavigationItem[]
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  if (pathname !== '/' && pathname !== '/landing') {
    breadcrumbs.push({
      label: 'Home',
      href: '/'
    });
  }
  
  const matchingItem = navigationItems.find(item => 
    pathname === item.path || pathname.startsWith(item.path + '/')
  );
  
  if (matchingItem && matchingItem.path !== '/') {
    breadcrumbs.push({
      label: matchingItem.label,
      href: matchingItem.path
    });
  }
  
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length > 1) {
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (breadcrumbs.some(b => b.href === currentPath)) {
        return;
      }
      
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
  if (!effectiveState.isAuthenticated) {
    return ['explore', 'home', 'landing'].includes(featureKey);
  }
  
  switch (effectiveState.userType) {
    case 'admin':
      return true;
    case 'establishment':
      return ['dashboard', 'events', 'profile', 'analytics'].includes(featureKey);
    case 'promoter':
      return ['dashboard', 'events', 'profile', 'analytics', 'promotion'].includes(featureKey);
    case 'individual':
    default:
      return ['explore', 'profile', 'notifications', 'favorites'].includes(featureKey);
  }
};
