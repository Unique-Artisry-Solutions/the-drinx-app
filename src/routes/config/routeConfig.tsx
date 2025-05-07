
import { lazy, ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { lazyLoad } from '@/utils/lazyLoad';
import { UserType } from '@/types/navigation/NavigationTypes';
import withRouteMetadata from '@/hoc/withRouteMetadata';

// Define common metadata for routes
export interface RouteMetadata {
  requiresAuth?: boolean;
  userType?: UserType | UserType[];
  breadcrumb?: string;
  hideInNav?: boolean;
  analyticsName?: string;
  icon?: React.ElementType;
  prefetchPriority?: 'high' | 'medium' | 'low';
  transitionEffect?: 'fade' | 'slide' | 'none';
}

// Define our extended route type
export interface AppRouteObject extends Omit<RouteObject, 'children'> {
  metadata?: RouteMetadata;
  children?: AppRouteObject[];
}

// Helper function to create routes with metadata
export function createRoute(
  path: string,
  element: React.ReactElement | null,
  metadata?: RouteMetadata
): AppRouteObject {
  // Apply metadata HOC to element if metadata exists
  const enhancedElement = metadata 
    ? React.createElement(withRouteMetadata(
        () => element, 
        { metadata }
      ))
    : element;
  
  return {
    path,
    element: enhancedElement,
    metadata
  };
}

// Helper function to create routes with lazy loading
export function createLazyRoute(
  path: string,
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  metadata?: RouteMetadata
): AppRouteObject {
  // Get the component using lazyLoad utility
  const LazyComponent = lazyLoad(importFunc, {
    priority: metadata?.prefetchPriority || 'low'
  });
  
  // Wrap with metadata HOC if metadata is provided
  const EnhancedComponent = metadata
    ? withRouteMetadata(LazyComponent, { metadata })
    : LazyComponent;
  
  return {
    path,
    element: <EnhancedComponent />,
    metadata
  };
}

// Example of how to use lazy loading for page components
export const userProfileRoute = createLazyRoute(
  '/profile',
  () => import('@/pages/profile/UserProfilePage'),
  {
    requiresAuth: true,
    userType: 'individual',
    breadcrumb: 'Profile',
    analyticsName: 'user_profile_page',
    prefetchPriority: 'high'
  }
);

export const flattenRoutes = (routes: AppRouteObject[]): AppRouteObject[] => {
  return routes.reduce<AppRouteObject[]>((acc, route) => {
    acc.push(route);
    if (route.children) {
      acc.push(...flattenRoutes(route.children));
    }
    return acc;
  }, []);
};

// Helper for dynamic route handling
export const extractRouteParams = (
  path: string, 
  url: string
): Record<string, string> => {
  const pathSegments = path.split('/').filter(Boolean);
  const urlSegments = url.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  
  pathSegments.forEach((segment, index) => {
    if (segment.startsWith(':') && urlSegments[index]) {
      const paramName = segment.slice(1);
      params[paramName] = urlSegments[index];
    }
  });
  
  return params;
};
