
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: ('individual' | 'establishment' | 'promoter' | 'admin')[];
  fallbackPath?: string;
  fallbackComponent?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  allowedUserTypes = [],
  fallbackPath = '/',
  fallbackComponent = null
}) => {
const { user, session, userType, isLoading, authStable, isAuthenticated, isUsingDevBypass } = useAuthenticatedUser();

// Wait for loading to finish
  if (isLoading && !isUsingDevBypass) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

// Development bypass via hook
  if (isUsingDevBypass) {
    console.log('ProtectedRoute: Dev bypass active, allowing access');
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

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    // Store the current location for potential redirect after login
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to={fallbackPath} replace />;
  }

  // Check user type restrictions
  if (allowedUserTypes.length > 0 && isAuthenticated) {
    const currentUserType = userType || 'individual';
    if (!allowedUserTypes.includes(currentUserType)) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      
      // Redirect to appropriate dashboard based on user type
      const userTypeDashboards: Record<string, string> = {
        admin: '/admin/system-breakdown',
        establishment: '/establishment/dashboard',
        promoter: '/promoter/dashboard',
        individual: '/explore'
      };
      
      return <Navigate to={userTypeDashboards[currentUserType] || fallbackPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
