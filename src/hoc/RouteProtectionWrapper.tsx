
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
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
const { user, session, userType, isLoading, authStable, isAuthenticated } = useAuthenticatedUser();
  const location = useLocation();

// Wait for initialization/loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
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

  const isAuthenticatedFlag = isAuthenticated;

// Check authentication requirement
  if (requireAuth && !isAuthenticatedFlag) {
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to={redirectTo} replace />;
  }

// Check user type restrictions
  const currentUserType = (userType || 'individual') as UserType;
  if (allowedUserTypes.length > 0 && isAuthenticatedFlag) {
    if (!allowedUserTypes.includes(currentUserType)) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      const userTypeDashboards: Record<UserType, string> = {
        admin: '/admin/system-breakdown',
        establishment: '/establishment/dashboard',
        promoter: '/promoter/dashboard',
        individual: '/explore'
      };
      return <Navigate to={userTypeDashboards[currentUserType]} replace />;
    }
  }

  return <>{children}</>;
};

export default RouteProtectionWrapper;
