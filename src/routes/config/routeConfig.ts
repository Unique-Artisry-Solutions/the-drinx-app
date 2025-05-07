
import { lazy, ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { lazyLoad } from '@/utils/lazyLoad';
import { UserType } from '@/types/navigation';

// Define common metadata for routes
export interface RouteMetadata {
  requiresAuth?: boolean;
  userType?: UserType | UserType[];
  breadcrumb?: string;
  hideInNav?: boolean;
  analyticsName?: string;
}

// Define our extended route type
export interface AppRouteObject extends Omit<RouteObject, 'children'> {
  metadata?: RouteMetadata;
  children?: AppRouteObject[];
}

// Helper function to create routes with metadata
export function createRoute(
  path: string,
  element: ReactNode,
  metadata?: RouteMetadata
): AppRouteObject {
  return {
    path,
    element,
    metadata
  };
}

// Helper function to create routes with lazy loading
export function createLazyRoute(
  path: string,
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  metadata?: RouteMetadata
): AppRouteObject {
  return {
    path,
    element: (lazyLoad(importFunc) as unknown) as ReactNode,
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
    analyticsName: 'user_profile_page'
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
