
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

  // Check impersonation state for route access
  const isImpersonating = !!(
    localStorage.getItem('impersonation_backup') &&
    (sessionStorage.getItem('impersonation_active') || 
     sessionStorage.getItem('impersonation_magic_link') ||
     window.location.hash.includes('access_token='))
  );

  console.log('RouteProtectionWrapper:', {
    pathname: location.pathname,
    requireAuth,
    allowedUserTypes,
    isAuthenticated,
    userType,
    isImpersonating,
    hasBackup: !!localStorage.getItem('impersonation_backup'),
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

  // Check user type restrictions - handle impersonation
  if (allowedUserTypes.length > 0 && isAuthenticated) {
    let currentUserType = userType || 'individual';
    
    // If impersonating and accessing establishment routes, allow access
    if (isImpersonating && location.pathname.startsWith('/establishment/')) {
      currentUserType = 'establishment';
      console.log('🎭 Allowing establishment access during impersonation');
    }
    
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
