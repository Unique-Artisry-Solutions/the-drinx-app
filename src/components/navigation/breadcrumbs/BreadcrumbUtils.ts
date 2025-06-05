
import { BreadcrumbConfig, routes, dynamicRoutes } from './BreadcrumbConfig';
import { UserType } from '@/types/navigation/NavigationTypes';

// Helper function to get the appropriate home path based on user type
const getHomePathByUserType = (userType: UserType | null, isAuthenticated: boolean): string => {
  if (!isAuthenticated || !userType) {
    return '/landing';
  }
  
  switch (userType) {
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter/dashboard';
    case 'admin':
      return '/admin/system-breakdown';
    case 'individual':
      return '/explore';
    default:
      return '/landing';
  }
};

// Helper function to get the appropriate home label based on user type
const getHomeLabelByUserType = (userType: UserType | null, isAuthenticated: boolean): string => {
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

// Helper function to build breadcrumbs from a pathname with proper auth context
export function buildBreadcrumbs(
  pathname: string, 
  userType: UserType | null = null, 
  isAuthenticated: boolean = false
): BreadcrumbConfig[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbConfig[] = [];
  
  // Always start with the appropriate home breadcrumb based on user type
  const homePath = getHomePathByUserType(userType, isAuthenticated);
  const homeLabel = getHomeLabelByUserType(userType, isAuthenticated);
  
  // Only add home breadcrumb if we're not already on the home page
  if (pathname !== homePath && pathname !== '/') {
    breadcrumbs.push({
      path: homePath,
      label: homeLabel,
    });
  }
  
  // Special case handling for base paths
  const handleSpecialBasePath = (basePath: string, section: string) => {
    if (!breadcrumbs.some(crumb => crumb.path === basePath)) {
      const baseConfig = routes[basePath];
      if (baseConfig) {
        breadcrumbs.push(baseConfig);
      } else {
        breadcrumbs.push({
          path: basePath,
          label: section,
        });
      }
    }
  };
  
  // Handle special case for establishment section
  if (pathname.startsWith('/establishment/')) {
    // If we're on the dashboard already, don't add a redundant breadcrumb
    if (pathname !== '/establishment/dashboard') {
      handleSpecialBasePath('/establishment/dashboard', 'Dashboard');
    }
  }
  
  // Handle special case for promoter section
  if (pathname.startsWith('/promoter/')) {
    // If we're on the dashboard already, don't add a redundant breadcrumb
    if (pathname !== '/promoter/dashboard') {
      handleSpecialBasePath('/promoter/dashboard', 'Dashboard');
    }
  }
  
  // Handle special case for admin section
  if (pathname.startsWith('/admin/')) {
    if (pathname !== '/admin/system-breakdown') {
      handleSpecialBasePath('/admin/system-breakdown', 'Admin');
    }
  }
  
  // Handle special case for profile section
  if (pathname.startsWith('/profile/')) {
    handleSpecialBasePath('/profile', 'Profile');
  }
  
  // Handle special case for bar-crawl section - redirect to swig-circuits
  if (pathname.startsWith('/bar-crawl') || pathname.startsWith('/bar-crawl-details/')) {
    const swigCircuitsPath = '/swig-circuits';
    if (!breadcrumbs.some(crumb => crumb.path === swigCircuitsPath)) {
      breadcrumbs.push(routes[swigCircuitsPath]);
    }
  }
  
  // Determine if this is a special route that has a dynamic ID
  const isDynamicRoute = dynamicRoutes.find(route => route.pattern.test(pathname));
  
  // Build path segments
  let currentPath = '';
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    
    // Fix for bar-crawl path - redirect to swig-circuits
    if (currentPath === '/bar-crawl') {
      currentPath = '/swig-circuits';
    }
    
    // Handle establishment base path special case
    if (currentPath === '/establishment') {
      // Skip this segment since we're redirecting to /establishment/dashboard
      continue;
    }
    
    // Handle promoter base path special case 
    if (currentPath === '/promoter') {
      // Skip this segment since we're redirecting to /promoter/dashboard
      continue;
    }
    
    // Skip if this path or a matching path already exists in breadcrumbs
    const pathAlreadyExists = breadcrumbs.some(crumb => crumb.path === currentPath);
    
    if (pathAlreadyExists) continue;
    
    // Handle dynamic routes
    if (isDynamicRoute && i === pathSegments.length - 1) {
      // Get the base path for the dynamic route
      const basePath = isDynamicRoute.base;
      
      // If we have a configuration for the base path, add it
      if (routes[basePath] && !breadcrumbs.some(crumb => crumb.path === basePath)) {
        breadcrumbs.push(routes[basePath]);
      }
      
      // Add the dynamic part with a formatted label
      const entityId = pathSegments[i];
      let displayLabel = isDynamicRoute.label;
      
      // Try to make the ID more readable if it's a UUID
      if (entityId.includes('-') && entityId.length > 8) {
        displayLabel = `${isDynamicRoute.label} #${entityId.substring(0, 8)}...`;
      }
      
      breadcrumbs.push({
        path: currentPath,
        label: displayLabel,
        icon: isDynamicRoute.icon
      });
      break;
    }
    
    // Add the route if it exists in our config
    if (routes[currentPath]) {
      breadcrumbs.push(routes[currentPath]);
    } else {
      // Try to handle nested routes not explicitly defined
      const segmentName = pathSegments[i].replace(/-/g, ' ');
      const formattedName = segmentName.charAt(0).toUpperCase() + segmentName.slice(1);
      breadcrumbs.push({
        path: currentPath,
        label: formattedName,
      });
    }
  }
  
  // Remove duplicate breadcrumbs (same path or same label next to each other)
  const uniqueBreadcrumbs = breadcrumbs.filter((crumb, index, array) => {
    // Keep if it's the first item or if it's different from the previous one by path
    return index === 0 || crumb.path !== array[index - 1].path;
  });
  
  return uniqueBreadcrumbs;
}

// Check if breadcrumbs should be shown for a given pathname
export function shouldShowBreadcrumbs(pathname: string): boolean {
  // List of paths where breadcrumbs should not be shown
  const excludedPaths = ['/landing', '/login', '/signup', '/', '/map', '/explore'];
  
  // Don't show breadcrumbs on excluded paths
  if (excludedPaths.includes(pathname)) {
    return false;
  }
  
  // Don't show breadcrumbs on admin login page
  if (pathname === '/admin/login') {
    return false;
  }
  
  return true;
}
