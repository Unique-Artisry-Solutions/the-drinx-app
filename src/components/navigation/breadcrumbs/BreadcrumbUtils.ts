
import { UserType } from '@/types/navigation/NavigationTypes';

export interface BreadcrumbItem {
  path: string;
  label: string;
}

/**
 * Routes that should not show breadcrumbs
 */
const ROUTES_WITHOUT_BREADCRUMBS = [
  '/',
  '/landing',
  '/promoter',
  '/establishment/dashboard',
  '/admin/system-breakdown',
  '/explore'
];

/**
 * Check if breadcrumbs should be shown for a given path
 */
export const shouldShowBreadcrumbs = (pathname: string): boolean => {
  return !ROUTES_WITHOUT_BREADCRUMBS.includes(pathname);
};

/**
 * Route configurations for breadcrumb generation
 */
const ROUTE_CONFIGS = [
  { path: '/explore', label: 'Explore' },
  { path: '/events', label: 'Events' },
  { path: '/swig-circuits', label: 'Swig Circuits' },
  { path: '/contact', label: 'Contact' },
  { path: '/profile', label: 'Profile' },
  { path: '/admin', label: 'Admin' },
  { path: '/establishment', label: 'Establishment' },
  { path: '/promoter', label: 'Dashboard' },
  { path: '/promoter/settings', label: 'Settings' },
  { path: '/promoter/profile', label: 'Profile' },
  { path: '/promoter/events', label: 'Events' },
  { path: '/promoter/followers', label: 'Followers' },
  { path: '/promoter/analytics', label: 'Analytics' }
];

/**
 * Get the home path based on user type
 */
export const getHomePathByUserType = (userType: UserType | null, isAuthenticated: boolean): string => {
  if (!isAuthenticated || !userType) {
    return '/landing';
  }
  
  switch (userType) {
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter';
    case 'admin':
      return '/admin/system-breakdown';
    case 'individual':
      return '/explore';
    default:
      return '/landing';
  }
};

/**
 * Get the home label based on user type
 */
export const getHomeLabelByUserType = (userType: UserType | null, isAuthenticated: boolean): string => {
  if (!isAuthenticated || !userType) {
    return 'Home';
  }
  
  switch (userType) {
    case 'establishment':
    case 'promoter':
    case 'admin':
      return 'Dashboard';
    case 'individual':
      return 'Explore';
    default:
      return 'Home';
  }
};

/**
 * Build breadcrumbs from the current path
 */
export const buildBreadcrumbs = (
  pathname: string,
  userType?: string | null,
  isAuthenticated?: boolean
): BreadcrumbItem[] => {
  if (!shouldShowBreadcrumbs(pathname)) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  const segments = pathname.split('/').filter(Boolean);
  
  // Add home breadcrumb
  const userHomePath = getHomePathByUserType(userType as UserType, isAuthenticated || false);
  const userHomeLabel = getHomeLabelByUserType(userType as UserType, isAuthenticated || false);
  
  breadcrumbs.push({
    path: userHomePath,
    label: userHomeLabel
  });

  // Build up breadcrumbs from path segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip adding breadcrumb for the dashboard root paths
    if (currentPath === '/promoter' || 
        currentPath === '/establishment/dashboard' || 
        currentPath === '/admin/system-breakdown' || 
        currentPath === '/explore') {
      return;
    }
    
    // Find matching route config
    const matchingConfig = ROUTE_CONFIGS.find(config => config.path === currentPath);
    
    if (matchingConfig) {
      breadcrumbs.push({
        path: currentPath,
        label: matchingConfig.label
      });
    } else {
      // Use segment as label if no configuration exists
      breadcrumbs.push({
        path: currentPath,
        label: segment.charAt(0).toUpperCase() + segment.slice(1)
      });
    }
  });
  
  return breadcrumbs;
};
