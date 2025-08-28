
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
const { user, session, userType, isLoading, authStable, isAuthenticated, isReady } = useAuthenticatedUser();
  const location = useLocation();

  // Debug logging for route protection
  console.log('RouteProtectionWrapper:', {
    pathname: location.pathname,
    requireAuth,
    allowedUserTypes,
    isAuthenticated,
    userType,
    isLoading,
    authStable,
    isReady,
    hasUser: !!user,
    hasSession: !!session
  });

  // **PHASE 2 FIX**: Improved loading state logic with timeout handling
  if (!isReady) {
    // Use timeout to prevent infinite loading
    const [showTimeout, setShowTimeout] = React.useState(false);
    
    React.useEffect(() => {
      const timeout = setTimeout(() => setShowTimeout(true), 5000);
      return () => clearTimeout(timeout);
    }, []);
    
    if (showTimeout) {
      console.warn('RouteProtectionWrapper: Auth timeout detected, forcing ready state');
      return <>{children}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Loading...' : !authStable ? 'Verifying authentication...' : 'Preparing dashboard...'}
          </p>
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
