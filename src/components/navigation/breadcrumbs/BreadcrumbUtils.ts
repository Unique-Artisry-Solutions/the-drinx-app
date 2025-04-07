
import { BreadcrumbConfig, routes, dynamicRoutes } from './BreadcrumbConfig';

// Helper function to build breadcrumbs from a pathname
export function buildBreadcrumbs(pathname: string): BreadcrumbConfig[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbConfig[] = [];
  
  // Always start with home
  breadcrumbs.push(routes['/']);
  
  // Handle special case for establishment section
  const isEstablishmentSection = pathname.startsWith('/establishment/');
  if (isEstablishmentSection && pathSegments.length > 1) {
    // Add 'Establishment' as a base node for the section if not already in breadcrumbs
    const establishmentBasePath = '/establishment/all-actions';
    if (!breadcrumbs.some(crumb => crumb.path === establishmentBasePath)) {
      breadcrumbs.push({
        path: establishmentBasePath,
        label: 'Establishment',
      });
    }
  }
  
  // Handle special case for admin section
  const isAdminSection = pathname.startsWith('/admin/');
  if (isAdminSection && pathSegments.length > 1) {
    // Add 'Admin' as a base node for the section if not already in breadcrumbs
    const adminBasePath = '/admin';
    if (!breadcrumbs.some(crumb => crumb.path === adminBasePath)) {
      breadcrumbs.push({
        path: adminBasePath,
        label: 'Admin',
      });
    }
  }
  
  // Handle special case for profile section
  const isProfileSection = pathname.startsWith('/profile/');
  if (isProfileSection && pathSegments.length > 1) {
    // Add 'Profile' as a base node for the section if not already in breadcrumbs
    const profileBasePath = '/profile';
    if (!breadcrumbs.some(crumb => crumb.path === profileBasePath)) {
      breadcrumbs.push({
        path: profileBasePath,
        label: 'Profile',
      });
    }
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
    
    // Skip if this path or a matching path already exists in breadcrumbs
    const pathAlreadyExists = breadcrumbs.some(crumb => 
      crumb.path === currentPath || 
      (crumb.path.startsWith('/establishment/') && currentPath === '/establishment')
    );
    
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
  
  // Build breadcrumbs
  const breadcrumbs = buildBreadcrumbs(pathname);
  
  // Only show breadcrumbs if we have at least 2 levels (home + something else)
  return breadcrumbs.length >= 2;
}
