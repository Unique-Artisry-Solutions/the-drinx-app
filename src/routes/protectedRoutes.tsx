
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
  const { isDevModeActive, devMode, isDevelopment, isInitialized, isStateStable } = useDevelopmentMode();
  
  const debugInfo = {
    userType,
    isDevModeActive,
    devMode,
    isDevelopment,
    isInitialized,
    isStateStable,
    shouldBypass: isDevelopment && isDevModeActive && isStateStable
  };
  
  console.log('ProtectedRouteWithChildren rendering:', debugInfo);
  
  // Wait for both initialization AND state stabilization
  if (!isInitialized || !isStateStable) {
    console.log('ProtectedRouteWithChildren: Waiting for development mode to stabilize');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // EARLY RETURN: In development mode with stable state, bypass protection completely
  if (isDevelopment && isDevModeActive && isStateStable) {
    console.log(`ProtectedRouteWithChildren: Development mode active and stable - BYPASSING protection for ${userType}`, {
      devMode,
      requestedUserType: userType,
      immediate: true
    });
    return children;
  }
  
  console.log(`ProtectedRouteWithChildren: Applying normal protection for ${userType}`);
  
  // The component is the child element
  const Component = () => children;
  const Protected = TypedProtectedRoute(Component, userType);
  return <Protected />;
};
