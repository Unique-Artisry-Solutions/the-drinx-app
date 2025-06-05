
import { matchPath } from 'react-router-dom';

/**
 * Check if a path is active based on the current pathname
 * @param currentPath The current URL path
 * @param menuPath The path to check against
 * @param exact If true, requires an exact match
 */
export const isPathActive = (currentPath: string, menuPath: string, exact = false): boolean => {
  if (exact) {
    return currentPath === menuPath;
  }
  
  // Special case for root path
  if (menuPath === '/' && currentPath === '/') {
    return true;
  }
  
  // Handle nested paths
  if (menuPath !== '/' && currentPath.startsWith(menuPath)) {
    // Handle potential partial matches (e.g. /user and /users)
    const nextCharInPath = currentPath.charAt(menuPath.length);
    return nextCharInPath === '' || nextCharInPath === '/' || nextCharInPath === '?';
  }
  
  return false;
};

/**
 * Creates a breadcrumb trail from dynamic routes
 * @param pathname The current pathname
 * @param routeConfigs The array of route configurations
 * @param userType The current user type to determine their home path
 * @param isAuthenticated Whether the user is authenticated
 */
export const createBreadcrumbsFromPath = (
  pathname: string,
  routeConfigs: Array<{ path: string; metadata?: { breadcrumb?: string } }>,
  userType?: string | null,
  isAuthenticated?: boolean
) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  // Get the user's home path
  const userHomePath = getHomePathByUserType(userType);
  
  // Console log for debugging
  console.log('Breadcrumb Debug:', {
    pathname,
    userType,
    isAuthenticated,
    userHomePath,
    isOnHomeDashboard: pathname === userHomePath
  });
  
  // Don't show any breadcrumbs if user is on their dashboard root
  // This includes /promoter, /establishment/dashboard, /admin/system-breakdown, /explore
  const isDashboardRoot = pathname === userHomePath || 
                          pathname === '/promoter' ||
                          pathname === '/establishment/dashboard' ||
                          pathname === '/admin/system-breakdown' ||
                          pathname === '/explore';
  
  if (isDashboardRoot) {
    console.log('On dashboard root, returning empty breadcrumbs');
    return [];
  }
  
  let currentPath = '';
  
  // Only add home breadcrumb if not on a dashboard root and not on landing page
  if (pathname !== '/' && pathname !== '/landing') {
    breadcrumbs.push({ 
      path: userHomePath,
      label: getUserHomeLabel(userType, isAuthenticated)
    });
  }
  
  // Build up breadcrumbs from path segments
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip adding breadcrumb for the dashboard root paths
    if (currentPath === '/promoter' || 
        currentPath === '/establishment/dashboard' || 
        currentPath === '/admin/system-breakdown' || 
        currentPath === '/explore') {
      return;
    }
    
    // Try to find a matching route config
    const matchingConfig = routeConfigs.find(config => {
      // Use matchPath from react-router to handle dynamic segments
      return matchPath(config.path, currentPath);
    });
    
    if (matchingConfig) {
      breadcrumbs.push({
        path: currentPath,
        label: matchingConfig.metadata?.breadcrumb || segment.charAt(0).toUpperCase() + segment.slice(1)
      });
    } else {
      // If no configuration exists, use the segment as the label
      breadcrumbs.push({
        path: currentPath,
        label: segment.charAt(0).toUpperCase() + segment.slice(1)
      });
    }
  });
  
  return breadcrumbs;
};

/**
 * Get the home label based on user type
 */
const getUserHomeLabel = (userType?: string | null, isAuthenticated?: boolean): string => {
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
 * Extract dynamic parameters from a route path
 * @param routePath The route path pattern (e.g. /users/:userId)
 * @param actualPath The actual URL path (e.g. /users/123)
 */
export const extractRouteParams = (
  routePath: string,
  actualPath: string
): Record<string, string> => {
  const match = matchPath(routePath, actualPath);
  return match?.params || {};
};

/**
 * Get the home path based on user type
 * @param userType The type of user
 */
export const getHomePathByUserType = (userType?: string | null): string => {
  if (!userType) return '/landing';
  
  switch (userType) {
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter'; // Changed from '/promoter/dashboard' to '/promoter'
    case 'admin':
      return '/admin/system-breakdown';
    default:
      return '/explore';
  }
};
