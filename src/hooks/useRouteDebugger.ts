
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

interface RouteDebugInfo {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  userType: string | null;
  isAuthenticated: boolean;
  isDevelopment: boolean;
  isDevModeActive: boolean;
  devMode: string | null;
  timestamp: string;
}

/**
 * Development-only route debugging hook
 */
export const useRouteDebugger = (enabled: boolean = false) => {
  const location = useLocation();
  const { userType, isAuthenticated, isLoading, authStable } = useAuth();
  const { isDevelopment, isDevModeActive, devMode, isInitialized } = useDevelopmentMode();
  
  useEffect(() => {
    if (!enabled || !isDevelopment) return;
    
    const debugInfo: RouteDebugInfo = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      userType,
      isAuthenticated,
      isDevelopment,
      isDevModeActive,
      devMode,
      timestamp: new Date().toISOString()
    };
    
    console.group(`🛣️ Route Debug: ${location.pathname}`);
    console.table(debugInfo);
    
    // Additional system state info
    console.log('🔄 System State:', {
      authLoading: isLoading,
      authStable,
      devInitialized: isInitialized,
      effectiveUserType: isDevelopment && isDevModeActive ? devMode : userType,
      effectiveAuth: isDevelopment && isDevModeActive ? !!devMode : isAuthenticated
    });
    
    // Route protection analysis
    const protectedPaths = ['/admin', '/establishment', '/promoter', '/profile', '/notifications'];
    const isProtectedRoute = protectedPaths.some(path => location.pathname.startsWith(path));
    
    if (isProtectedRoute) {
      console.log('🔒 Protected Route Analysis:', {
        isProtected: true,
        hasAccess: isDevelopment && isDevModeActive ? 
          'Development bypass active' : 
          isAuthenticated ? 'Authenticated' : 'Not authenticated',
        userTypeMatch: 'Check route configuration'
      });
    }
    
    console.groupEnd();
  }, [
    location.pathname,
    location.search,
    location.hash,
    location.state,
    userType,
    isAuthenticated,
    isLoading,
    authStable,
    isDevelopment,
    isDevModeActive,
    devMode,
    isInitialized,
    enabled
  ]);
  
  return {
    currentRoute: location.pathname,
    routeState: location.state,
    debugInfo: enabled && isDevelopment ? {
      userType: isDevelopment && isDevModeActive ? devMode : userType,
      isAuthenticated: isDevelopment && isDevModeActive ? !!devMode : isAuthenticated,
      systemReady: !isLoading && authStable && isInitialized
    } : null
  };
};

export default useRouteDebugger;
