
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useImpersonationState } from '@/hooks/useImpersonationState';
import { clearImpersonationFlags } from '@/utils/impersonationValidator';

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
  const { isImpersonating, isStable: impersonationStable } = useImpersonationState();
  const location = useLocation();

  console.log('RouteProtectionWrapper:', {
    pathname: location.pathname,
    requireAuth,
    allowedUserTypes,
    isAuthenticated,
    userType,
    isImpersonating,
    impersonationStable,
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

  // Wait for auth and impersonation to stabilize
  if (!authStable || !impersonationStable) {
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

  // Check user type restrictions - handle impersonation with strict validation
  if (allowedUserTypes.length > 0 && isAuthenticated) {
    let currentUserType = userType || 'individual';
    let hasValidAccess = false;
    
    // Validate impersonation for establishment access
    if (location.pathname.startsWith('/establishment/')) {
      if (isImpersonating) {
        // Valid impersonation allows establishment access
        currentUserType = 'establishment';
        hasValidAccess = allowedUserTypes.includes('establishment');
        console.log('🎭 Allowing establishment access during valid impersonation');
      } else if (userType === 'admin') {
        // Admin without impersonation should not access establishment routes
        console.log('🚫 Admin user attempting establishment access without impersonation');
        clearImpersonationFlags(); // Clean up any orphaned state
        return <Navigate to="/admin/system-breakdown" replace />;
      }
    } else {
      // For non-establishment routes, use the actual user type
      hasValidAccess = allowedUserTypes.includes(currentUserType);
    }
    
    // Check if user has valid access
    if (!hasValidAccess) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      
      // Redirect to appropriate dashboard based on actual user type (not impersonated)
      const userTypeDashboards: Record<string, string> = {
        admin: '/admin/system-breakdown',
        establishment: '/establishment/dashboard',
        promoter: '/promoter/dashboard',
        individual: '/explore'
      };
      
      const actualUserType = userType || 'individual';
      console.log(`🔄 Redirecting ${actualUserType} user to appropriate dashboard`);
      return <Navigate to={userTypeDashboards[actualUserType] || fallbackPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
