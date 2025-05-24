
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/hooks/useDevelopmentMode';
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
    const { isDevModeActive, devMode, isDevelopment, isInitialized } = useDevelopmentMode();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    
    useEffect(() => {
      console.log('withAuthProtection - Auth check:', { 
        isDevModeActive, 
        devMode, 
        isDevelopment,
        isInitialized,
        path: location.pathname,
        userTypes,
        requireAuth,
        user: !!user,
        session: !!session,
        authStable,
        isLoading
      });
      
      // Wait for development mode initialization
      if (!isInitialized) return;
      
      // In development mode, bypass authentication checks completely
      if (isDevelopment && isDevModeActive) {
        console.log('withAuthProtection: Development mode active, bypassing all auth protection');
        setShouldRedirect(false);
        return;
      }
      
      // Wait for auth to stabilize
      if (isLoading || !authStable) return;
      
      // Check authentication requirement
      if (requireAuth && (!user || !session)) {
        console.log("withAuthProtection: Auth required but no user/session");
        localStorage.setItem('auth_redirect', location.pathname);
        setShouldRedirect(true);
        return;
      }
      
      // Check user type requirement
      if (userTypes.length > 0 && (user && session)) {
        const currentUserType = userType || 'individual';
        
        if (!userTypes.includes(currentUserType as UserType)) {
          console.log("withAuthProtection: User type mismatch", { currentUserType, requiredTypes: userTypes });
          localStorage.setItem('auth_redirect', location.pathname);
          setShouldRedirect(true);
          return;
        }
      }
      
      // All checks passed
      setShouldRedirect(false);
    }, [user, session, isLoading, authStable, userType, location.pathname, isDevModeActive, devMode, isDevelopment, isInitialized]);
    
    // Show loading state while checking auth (but not in dev mode)
    if (!isInitialized) {
      return showLoadingState ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing...</p>
          </div>
        </div>
      ) : null;
    }
    
    if ((isLoading || !authStable) && showLoadingState && !(isDevelopment && isDevModeActive)) {
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
    
    // Redirect if checks failed (but not in dev mode)
    if (shouldRedirect && !(isDevelopment && isDevModeActive)) {
      const redirectPath = userTypes.length > 0 
        ? { 
            pathname: redirectTo, 
            search: new URLSearchParams({ userType: userTypes[0] }).toString() 
          } 
        : redirectTo;
      
      return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
    }
    
    // Render protected component if all checks pass or in dev mode
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
    const { isDevModeActive, devMode, isDevelopment, isInitialized } = useDevelopmentMode();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    
    useEffect(() => {
      console.log('withAdminProtection - Admin auth check:', { 
        isDevModeActive, 
        devMode, 
        isDevelopment,
        isInitialized,
        path: location.pathname,
        user: !!user,
        session: !!session,
        userType,
        authStable,
        isLoading
      });
      
      // Wait for development mode initialization
      if (!isInitialized) return;
      
      // In development mode with admin role, bypass admin authentication checks
      if (isDevelopment && isDevModeActive && devMode === 'admin') {
        console.log('withAdminProtection: Development mode active with admin role, bypassing auth protection');
        setShouldRedirect(false);
        return;
      }
      
      if (isLoading || !authStable) return;
      
      // Check for admin authentication through regular auth system
      const isAuthorized = (user && session) && userType === 'admin';
      
      if (!isAuthorized) {
        console.log("withAdminProtection: Admin authorization failed", { user: !!user, session: !!session, userType });
        localStorage.setItem('auth_redirect', location.pathname);
        setShouldRedirect(true);
        return;
      }
      
      setShouldRedirect(false);
    }, [user, session, isLoading, authStable, userType, location.pathname, isDevModeActive, devMode, isDevelopment, isInitialized]);
    
    if (!isInitialized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing...</p>
          </div>
        </div>
      );
    }
    
    if ((isLoading || !authStable) && !(isDevelopment && isDevModeActive && devMode === 'admin')) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying admin authorization...</p>
          </div>
        </div>
      );
    }
    
    if (shouldRedirect && !(isDevelopment && isDevModeActive && devMode === 'admin')) {
      return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
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
