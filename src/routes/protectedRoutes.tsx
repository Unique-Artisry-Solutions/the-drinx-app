
import React from 'react';
import { withAuthProtection, withAdminProtection, withUserTypeProtection } from '@/hoc/withAuthProtection';
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
