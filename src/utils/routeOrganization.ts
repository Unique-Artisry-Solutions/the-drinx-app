
import { UserType } from '@/types/navigation';

// Define our own route interface that includes the properties we need
export interface EnhancedRouteConfig {
  path?: string;
  element?: React.ReactNode;
  children?: EnhancedRouteConfig[];
  index?: boolean;
  userType?: UserType[];
  requireAuth?: boolean;
  prefetchPriority?: 'high' | 'medium' | 'low';
  breadcrumbLabel?: string;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * Groups routes by user type for better organization
 */
export const groupRoutesByUserType = (routes: EnhancedRouteConfig[]) => {
  const grouped = {
    admin: [] as EnhancedRouteConfig[],
    establishment: [] as EnhancedRouteConfig[],
    promoter: [] as EnhancedRouteConfig[],
    individual: [] as EnhancedRouteConfig[],
    public: [] as EnhancedRouteConfig[]
  };
  
  routes.forEach(route => {
    if (!route.userType || route.userType.length === 0) {
      grouped.public.push(route);
    } else {
      route.userType.forEach(type => {
        grouped[type].push(route);
      });
    }
  });
  
  return grouped;
};

/**
 * Validates route parameters for dynamic routes
 */
export const validateRouteParams = (
  params: Record<string, string | undefined>,
  validationRules: Record<string, (value: string) => boolean>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  Object.entries(validationRules).forEach(([paramName, validator]) => {
    const value = params[paramName];
    if (value && !validator(value)) {
      errors.push(`Invalid parameter: ${paramName}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Common parameter validators
 */
export const paramValidators = {
  uuid: (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
  numeric: (value: string) => /^\d+$/.test(value),
  alphanumeric: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
  slug: (value: string) => /^[a-z0-9-]+$/.test(value)
};

/**
 * Generate breadcrumb data for nested routes
 */
export const generateRouteBreadcrumbs = (
  pathname: string,
  routeConfigs: EnhancedRouteConfig[]
): Array<{ path: string; label: string; isActive: boolean }> => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ path: string; label: string; isActive: boolean }> = [];
  
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isActive = index === pathSegments.length - 1;
    
    // Find matching route config
    const matchingRoute = routeConfigs.find(route => {
      if (route.path === currentPath) return true;
      if (route.path?.includes(':')) {
        const routePattern = route.path.split('/');
        const pathPattern = currentPath.split('/');
        if (routePattern.length === pathPattern.length) {
          return routePattern.every((routeSegment, i) => 
            routeSegment.startsWith(':') || routeSegment === pathPattern[i]
          );
        }
      }
      return false;
    });
    
    const label = matchingRoute?.breadcrumbLabel || 
                  segment.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ');
    
    breadcrumbs.push({
      path: currentPath,
      label,
      isActive
    });
  });
  
  return breadcrumbs;
};
