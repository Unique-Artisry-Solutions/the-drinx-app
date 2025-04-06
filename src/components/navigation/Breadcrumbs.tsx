import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface BreadcrumbConfig {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

// Comprehensive route mapping for the application
const routes: Record<string, BreadcrumbConfig> = {
  '/': { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
  '/explore': { path: '/explore', label: 'Explore' },
  '/map': { path: '/map', label: 'Map' },
  
  // Profile section
  '/profile': { path: '/profile', label: 'Profile' },
  '/profile/bar-crawls': { path: '/profile/bar-crawls', label: 'Swig Circuits' },
  '/profile/favorites': { path: '/profile/favorites', label: 'Favorites' },
  '/profile/visited': { path: '/profile/visited', label: 'Visited' },
  '/profile/rewards': { path: '/profile/rewards', label: 'Rewards' },
  '/profile/my-creations': { path: '/profile/my-creations', label: 'My Creations' },
  '/profile/settings': { path: '/profile/settings', label: 'Settings' },
  
  // Swig Circuit related routes
  '/bar-crawl': { path: '/bar-crawl', label: 'Swig Circuit' },
  '/create-bar-crawl': { path: '/create-bar-crawl', label: 'Create Swig Circuit' },
  
  // Establishment routes
  '/establishment/profile': { path: '/establishment/profile', label: 'Profile' },
  '/establishment/bar-crawl-requests': { path: '/establishment/bar-crawl-requests', label: 'Swig Circuit Requests' },
  '/establishment/reviews': { path: '/establishment/reviews', label: 'Reviews' },
  '/establishment/analytics': { path: '/establishment/analytics', label: 'Analytics' },
  '/establishment/all-actions': { path: '/establishment/all-actions', label: 'All Actions' },
  '/establishment/mocktail-suggestions': { path: '/establishment/mocktail-suggestions', label: 'Suggestions' },
  
  // Admin routes
  '/admin': { path: '/admin', label: 'Admin' },
  '/admin/users': { path: '/admin/users', label: 'Users Management' },
  '/admin/establishments': { path: '/admin/establishments', label: 'Establishments' },
  
  // Other pages
  '/settings': { path: '/settings', label: 'Settings' },
  '/mission': { path: '/mission', label: 'Our Mission' },
  '/resources': { path: '/resources', label: 'Resources' },
  '/pricing': { path: '/pricing', label: 'Pricing' },
};

// Add dynamic path matching patterns
const dynamicRoutes = [
  { pattern: /^\/bar-crawl\/(.+)$/, base: '/bar-crawl', label: 'Swig Circuit Details' },
  { pattern: /^\/bar-crawl-profile\/(.+)$/, base: '/bar-crawl-profile', label: 'Swig Circuit Details' },
  { pattern: /^\/bar-crawl-details\/(.+)$/, base: '/bar-crawl-details', label: 'Swig Circuit Details' },
  { pattern: /^\/establishment\/(\d+)$/, base: '/establishment', label: 'Establishment Details' },
  { pattern: /^\/establishment\/mocktail\/(.+)$/, base: '/establishment/mocktail', label: 'Mocktail Details' },
  { pattern: /^\/cocktail\/(.+)$/, base: '/cocktail', label: 'Cocktail Details' },
  { pattern: /^\/profile\/my-creations\/(.+)$/, base: '/profile/my-creations', label: 'Swig Circuit Management' },
  { pattern: /^\/admin\/users\/(.+)$/, base: '/admin/users', label: 'User Details' },
  { pattern: /^\/admin\/establishments\/(.+)$/, base: '/admin/establishments', label: 'Establishment Details' },
];

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on specific pages
  const excludedPaths = ['/landing', '/login', '/signup', '/', '/map', '/explore'];
  if (excludedPaths.includes(location.pathname)) return null;
  
  // Build breadcrumb paths
  const breadcrumbs: BreadcrumbConfig[] = [];
  
  // Always start with home
  breadcrumbs.push(routes['/']);
  
  // Handle special case for establishment section
  const isEstablishmentSection = location.pathname.startsWith('/establishment/');
  if (isEstablishmentSection && pathSegments.length > 1) {
    // Add 'Establishment' as a base node for the section
    breadcrumbs.push({
      path: '/establishment/all-actions',
      label: 'Establishment',
    });
  }
  
  // Handle special case for admin section
  const isAdminSection = location.pathname.startsWith('/admin/');
  if (isAdminSection && pathSegments.length > 1) {
    // Add 'Admin' as a base node for the section
    breadcrumbs.push({
      path: '/admin',
      label: 'Admin',
    });
  }
  
  // Handle special case for profile section
  const isProfileSection = location.pathname.startsWith('/profile/');
  if (isProfileSection && pathSegments.length > 1) {
    // Add 'Profile' as a base node for the section
    breadcrumbs.push({
      path: '/profile',
      label: 'Profile',
    });
  }
  
  // Determine if this is a special route that has a dynamic ID
  const isDynamicRoute = dynamicRoutes.find(route => route.pattern.test(location.pathname));
  
  // Build path segments
  let currentPath = '';
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    
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
      // Skip if this path already exists in breadcrumbs (to avoid duplicates after special section handling)
      if (!breadcrumbs.some(crumb => crumb.path === currentPath)) {
        breadcrumbs.push(routes[currentPath]);
      }
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
  
  // Only show breadcrumbs if we have at least 2 levels (home + something else)
  if (breadcrumbs.length < 2) return null;
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <React.Fragment key={crumb.path || index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center">
                    {crumb.icon && crumb.icon}
                    <span className={crumb.icon ? "ml-1" : ""}>{crumb.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path} className="flex items-center hover:text-primary transition-colors">
                      {crumb.icon && crumb.icon}
                      <span className={crumb.icon ? "ml-1" : ""}>{crumb.label}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator><ChevronRight className="h-3 w-3" /></BreadcrumbSeparator>}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
