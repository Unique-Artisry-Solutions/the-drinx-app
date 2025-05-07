
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
 */
export const createBreadcrumbsFromPath = (
  pathname: string,
  routeConfigs: Array<{ path: string; metadata?: { breadcrumb?: string } }>
) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  let currentPath = '';
  
  // Always include home if not on home page
  if (pathname !== '/') {
    breadcrumbs.push({ 
      path: '/',
      label: 'Home'
    });
  }
  
  // Build up breadcrumbs from path segments
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
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
