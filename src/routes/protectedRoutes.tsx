
import React from 'react';
import { withAuthProtection, withAdminProtection, withUserTypeProtection } from '@/hoc/withAuthProtection';
import { useDevelopmentMode } from '@/hooks/useDevelopmentMode';
import { UserType } from '@/types/navigation';

/**
 * Creates a protected route component that requires authentication
 */
export const ProtectedRoute = (Component: React.ComponentType<any>) => {
  return withAuthProtection(Component, {
    requireAuth: true,
    redirectTo: '/login',
    showLoadingState: true
  });
};

/**
 * Creates an admin route component that requires admin authentication
 */
export const AdminRoute = (Component: React.ComponentType<any>) => {
  return withAdminProtection(Component);
};

/**
 * Creates a typed protected route component that requires specific user type
 */
export const TypedProtectedRoute = (
  Component: React.ComponentType<any>, 
  userType: UserType
) => {
  return withUserTypeProtection(Component, userType);
};

/**
 * Higher order component for creating routes with children prop support
 * This allows TypedProtectedRoute to be used as JSX element
 */
export const ProtectedRouteWithChildren: React.FC<{
  children: React.ReactElement;
  userType: UserType;
}> = ({ children, userType }) => {
  const { isDevModeActive, devMode } = useDevelopmentMode();
  
  // In development mode, bypass protection and render directly
  if (isDevModeActive && devMode === userType) {
    console.log(`ProtectedRouteWithChildren: Development mode active for ${userType}, bypassing protection`);
    return children;
  }
  
  // The component is the child element
  const Component = () => children;
  const Protected = TypedProtectedRoute(Component, userType);
  return <Protected />;
};
