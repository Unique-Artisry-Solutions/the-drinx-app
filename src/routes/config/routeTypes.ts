
import { ReactNode } from 'react';
import { UserType } from '@/types/navigation';

export interface RouteConfig {
  path: string;
  element: ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: UserType[];
  redirectTo?: string;
  index?: boolean;
  children?: RouteConfig[];
}

export interface ProtectedRouteConfig extends RouteConfig {
  requireAuth: true;
  allowedUserTypes: UserType[];
}

export const createProtectedRoute = (
  path: string,
  element: ReactNode,
  allowedUserTypes: UserType[],
  options?: {
    redirectTo?: string;
    index?: boolean;
    children?: RouteConfig[];
  }
): ProtectedRouteConfig => ({
  path,
  element,
  requireAuth: true,
  allowedUserTypes,
  redirectTo: options?.redirectTo || '/login',
  index: options?.index,
  children: options?.children
});

export const createPublicRoute = (
  path: string,
  element: ReactNode,
  options?: {
    index?: boolean;
    children?: RouteConfig[];
  }
): RouteConfig => ({
  path,
  element,
  requireAuth: false,
  allowedUserTypes: [],
  index: options?.index,
  children: options?.children
});
