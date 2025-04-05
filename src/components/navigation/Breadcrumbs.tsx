
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

const routes: Record<string, BreadcrumbConfig> = {
  '/': { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
  '/explore': { path: '/explore', label: 'Explore' },
  '/profile': { path: '/profile', label: 'Profile' },
  '/profile/bar-crawls': { path: '/profile/bar-crawls', label: 'Swig Circuits' },
  '/profile/favorites': { path: '/profile/favorites', label: 'Favorites' },
  '/profile/visited': { path: '/profile/visited', label: 'Visited' },
  '/profile/rewards': { path: '/profile/rewards', label: 'Rewards' },
  '/profile/my-creations': { path: '/profile/my-creations', label: 'My Creations' },
  '/profile/settings': { path: '/profile/settings', label: 'Settings' },
  '/bar-crawl': { path: '/bar-crawl', label: 'Swig Circuit' },
  '/create-bar-crawl': { path: '/create-bar-crawl', label: 'Create Swig Circuit' },
  
  // Establishment routes
  '/establishment/profile': { path: '/establishment/profile', label: 'Establishment Profile' },
  '/establishment/bar-crawl-requests': { path: '/establishment/bar-crawl-requests', label: 'Swig Circuit Requests' },
  '/establishment/reviews': { path: '/establishment/reviews', label: 'Reviews' },
  '/establishment/analytics': { path: '/establishment/analytics', label: 'Analytics' },
  '/establishment/all-actions': { path: '/establishment/all-actions', label: 'All Actions' },
};

// Add dynamic path matching patterns
const dynamicRoutes = [
  { pattern: /^\/bar-crawl\/(.+)$/, base: '/bar-crawl', label: 'Swig Circuit Details' },
  { pattern: /^\/bar-crawl-profile\/(.+)$/, base: '/bar-crawl-profile', label: 'Swig Circuit Details' },
  { pattern: /^\/bar-crawl-details\/(.+)$/, base: '/bar-crawl-details', label: 'Swig Circuit Details' },
  { pattern: /^\/establishment\/(.+)$/, base: '/establishment', label: 'Establishment' },
  { pattern: /^\/establishment\/mocktail\/(.+)$/, base: '/establishment/mocktail', label: 'Mocktail Details' },
  { pattern: /^\/cocktail\/(.+)$/, base: '/cocktail', label: 'Cocktail' },
  { pattern: /^\/profile\/my-creations\/(.+)$/, base: '/profile/my-creations', label: 'Swig Circuit Management' },
];

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) return null; // Don't show breadcrumbs on homepage
  
  // Don't show breadcrumbs on specific pages
  const excludedPaths = ['/landing', '/login', '/signup', '/mission', '/map', '/explore'];
  if (excludedPaths.includes(location.pathname)) return null;
  
  // Determine if this is a special route that has a dynamic ID
  const isDynamicRoute = dynamicRoutes.find(route => route.pattern.test(location.pathname));
  
  // Build breadcrumb paths
  const breadcrumbs: BreadcrumbConfig[] = [routes['/']];
  
  let currentPath = '';
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    
    // Handle dynamic routes
    if (isDynamicRoute && i === pathSegments.length - 1) {
      // Get the base path for the dynamic route
      const basePath = isDynamicRoute.base;
      
      // If we have a configuration for the base path, add it
      if (routes[basePath]) {
        // Only add if it's not already in the breadcrumbs
        if (!breadcrumbs.some(crumb => crumb.path === basePath)) {
          breadcrumbs.push(routes[basePath]);
        }
      }
      
      breadcrumbs.push({
        path: currentPath,
        label: isDynamicRoute.label,
      });
      break;
    }
    
    // Add the route if it exists in our config
    if (routes[currentPath]) {
      breadcrumbs.push(routes[currentPath]);
    } else {
      // Try to handle nested routes by checking if the current segment has a parent path
      const parentPaths = pathSegments.slice(0, i).join('/');
      if (parentPaths && routes[`/${parentPaths}`]) {
        const segmentName = pathSegments[i].replace(/-/g, ' ');
        breadcrumbs.push({
          path: currentPath,
          label: segmentName.charAt(0).toUpperCase() + segmentName.slice(1),
        });
      }
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
            <React.Fragment key={crumb.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center">
                    {crumb.icon && crumb.icon}
                    <span className={crumb.icon ? "ml-1" : ""}>{crumb.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path} className="flex items-center hover:text-material-primary transition-colors">
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
