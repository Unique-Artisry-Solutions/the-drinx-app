
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
  '/profile/bar-crawls': { path: '/profile/bar-crawls', label: 'Bar Crawls' },
  '/profile/favorites': { path: '/profile/favorites', label: 'Favorites' },
  '/profile/visited': { path: '/profile/visited', label: 'Visited' },
  '/bar-crawl': { path: '/bar-crawl', label: 'Bar Crawl' },
};

// Add dynamic path matching patterns
const dynamicRoutes = [
  { pattern: /^\/bar-crawl-profile\/(.+)$/, base: '/bar-crawl-profile', label: 'Crawl Details' },
  { pattern: /^\/bar-crawl-details\/(.+)$/, base: '/bar-crawl-details', label: 'Crawl Details' },
  { pattern: /^\/establishment\/(.+)$/, base: '/establishment', label: 'Establishment' },
  { pattern: /^\/cocktail\/(.+)$/, base: '/cocktail', label: 'Cocktail' },
];

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) return null; // Don't show breadcrumbs on homepage
  
  // Determine if this is a special route that has a dynamic ID
  const isDynamicRoute = dynamicRoutes.find(route => route.pattern.test(location.pathname));
  
  // Build breadcrumb paths
  const breadcrumbs: BreadcrumbConfig[] = [routes['/']];
  
  let currentPath = '';
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    
    // Handle dynamic routes
    if (isDynamicRoute && i === pathSegments.length - 1) {
      breadcrumbs.push({
        path: currentPath,
        label: isDynamicRoute.label,
      });
      break;
    }
    
    // Add the route if it exists in our config
    if (routes[currentPath]) {
      breadcrumbs.push(routes[currentPath]);
    }
  }
  
  // Only show breadcrumbs if we have at least 2 levels (home + something else)
  if (breadcrumbs.length < 2) return null;
  
  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <React.Fragment key={crumb.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {crumb.icon && crumb.icon}
                    <span className={crumb.icon ? "ml-1" : ""}>{crumb.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path} className="flex items-center">
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
