
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
  const { user, session, userType, isLoading, authStable, isAuthenticated } = useAuthenticatedUser();
  const location = useLocation();

  console.log('RouteProtectionWrapper:', {
    pathname: location.pathname,
    requireAuth,
    allowedUserTypes,
    isAuthenticated,
    userType,
    authStable
  });

// Wait for loading to finish
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

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    // Store the current location for potential redirect after login
    try {
      localStorage.setItem('auth_redirect', location.pathname);
    } catch (error) {
      console.warn('Failed to store redirect path:', error);
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Check user type restrictions
  if (allowedUserTypes.length > 0 && isAuthenticated) {
    const currentUserType = userType || 'individual';
    const hasValidAccess = allowedUserTypes.includes(currentUserType);
    
    // Check if user has valid access
    if (!hasValidAccess) {
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
      
      console.log(`🔄 Redirecting ${currentUserType} user to appropriate dashboard`);
      return <Navigate to={userTypeDashboards[currentUserType] || fallbackPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
