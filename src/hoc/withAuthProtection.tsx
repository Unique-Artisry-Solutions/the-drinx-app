
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { UserType } from '@/types/navigation';

export interface AuthProtectionOptions {
  requireAuth?: boolean;
  userTypes?: UserType[];
  redirectTo?: string;
  showLoadingState?: boolean;
  fallbackComponent?: React.ReactNode;
}

/**
 * Higher Order Component (HOC) that provides authentication protection
 * @param Component The component to wrap with auth protection
 * @param options Configuration options for the protection
 */
export function withAuthProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: AuthProtectionOptions = {}
) {
  const {
    requireAuth = true,
    userTypes = [],
    redirectTo = '/login',
    showLoadingState = true,
    fallbackComponent = null
  } = options;

  const ProtectedComponent: React.FC<P> = (props) => {
    const { user, session, isLoading, authStable, userType } = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    
    useEffect(() => {
      // Wait for auth to stabilize
      if (isLoading || !authStable) return;
      
      // Check authentication requirement
      if (requireAuth && (!user || !session)) {
        console.log("Auth required but no user/session");
        localStorage.setItem('auth_redirect', location.pathname);
        setShouldRedirect(true);
        return;
      }
      
      // Check user type requirement
      if (userTypes.length > 0 && (user && session)) {
        const currentUserType = userType || 'individual';
        
        if (!userTypes.includes(currentUserType as UserType)) {
          console.log("User type mismatch", { currentUserType, requiredTypes: userTypes });
          localStorage.setItem('auth_redirect', location.pathname);
          setShouldRedirect(true);
          return;
        }
      }
      
      // All checks passed
      setShouldRedirect(false);
    }, [user, session, isLoading, authStable, userType, location.pathname]);
    
    // Show loading state while checking auth
    if ((isLoading || !authStable) && showLoadingState) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying authentication...</p>
          </div>
        </div>
      );
    }
    
    // Show fallback component if provided
    if (shouldRedirect && fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    // Redirect if checks failed
    if (shouldRedirect) {
      const redirectPath = userTypes.length > 0 
        ? { 
            pathname: redirectTo, 
            search: new URLSearchParams({ userType: userTypes[0] }).toString() 
          } 
        : redirectTo;
      
      return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
    }
    
    // Render protected component if all checks pass
    return <Component {...props} />;
  };

  return ProtectedComponent;
}

/**
 * HOC specifically for admin routes
 */
export function withAdminProtection<P extends object>(
  Component: React.ComponentType<P>
) {
  const AdminProtectedComponent: React.FC<P> = (props) => {
    const { user, session, isLoading, authStable, userType } = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    
    useEffect(() => {
      if (isLoading || !authStable) return;
      
      // Check for admin authentication through regular auth system
      const isAuthorized = (user && session) && userType === 'admin';
      
      if (!isAuthorized) {
        console.log("Admin authorization failed");
        localStorage.setItem('auth_redirect', location.pathname);
        setShouldRedirect(true);
        return;
      }
      
      setShouldRedirect(false);
    }, [user, session, isLoading, authStable, userType, location.pathname]);
    
    if (isLoading || !authStable) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying admin authorization...</p>
          </div>
        </div>
      );
    }
    
    if (shouldRedirect) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    return <Component {...props} />;
  };

  return AdminProtectedComponent;
}

/**
 * HOC for routes that require specific user types
 */
export function withUserTypeProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredUserType: UserType
) {
  return withAuthProtection(Component, {
    requireAuth: true,
    userTypes: [requiredUserType],
    redirectTo: '/login',
    showLoadingState: true
  });
}
