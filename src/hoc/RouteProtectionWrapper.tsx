
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { UserType } from '@/types/navigation';

interface RouteProtectionWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: UserType[];
  redirectTo?: string;
  fallbackComponent?: React.ReactNode;
}

export const RouteProtectionWrapper: React.FC<RouteProtectionWrapperProps> = ({
  children,
  requireAuth = false,
  allowedUserTypes = [],
  redirectTo = '/login',
  fallbackComponent = null
}) => {
  const { user, session, userType, isLoading, authStable } = useAuth();
  const { isDevelopment, isDevModeActive, devMode, isInitialized } = useDevelopmentMode();
  const location = useLocation();

  // Wait for initialization
  if (!isInitialized || (isLoading && !(isDevelopment && isDevModeActive))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Development mode bypass
  if (isDevelopment && isDevModeActive) {
    console.log('RouteProtectionWrapper: Development mode active, bypassing protection');
    return <>{children}</>;
  }

  // Wait for auth to stabilize
  if (!authStable) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!(user && session);
  const currentUserType = userType || 'individual';

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to={redirectTo} replace />;
  }

  // Check user type restrictions
  if (allowedUserTypes.length > 0 && isAuthenticated) {
    if (!allowedUserTypes.includes(currentUserType as UserType)) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      
      // Redirect to appropriate dashboard based on user type
      const userTypeDashboards: Record<UserType, string> = {
        admin: '/admin/system-breakdown',
        establishment: '/establishment/dashboard',
        promoter: '/promoter/dashboard',
        individual: '/explore'
      };
      
      return <Navigate to={userTypeDashboards[currentUserType as UserType]} replace />;
    }
  }

  return <>{children}</>;
};

export default RouteProtectionWrapper;
