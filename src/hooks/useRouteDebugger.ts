
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

export const useRouteDebugger = (enabled: boolean = false) => {
  const location = useLocation();
  const { userType, isAuthenticated } = useAuth();
  const { isDevelopment, isDevModeActive, devMode } = useDevelopmentMode();
  
  useEffect(() => {
    if (!enabled || !isDevelopment) return;
    
    const effectiveUserType = isDevelopment && isDevModeActive ? devMode : userType;
    const effectiveAuth = isDevelopment && isDevModeActive ? !!devMode : isAuthenticated;
    
    console.group(`🛣️ Route: ${location.pathname}`);
    console.log('User:', effectiveUserType, 'Auth:', effectiveAuth);
    
    const protectedPaths = ['/admin', '/establishment', '/promoter'];
    const isProtected = protectedPaths.some(path => location.pathname.startsWith(path));
    
    if (isProtected) {
      console.log('🔒 Protected route -', effectiveAuth ? 'Access granted' : 'Access denied');
    }
    
    console.groupEnd();
  }, [location.pathname, userType, isAuthenticated, isDevelopment, isDevModeActive, devMode, enabled]);
  
  return {
    currentRoute: location.pathname,
    debugInfo: enabled && isDevelopment ? {
      userType: isDevelopment && isDevModeActive ? devMode : userType,
      isAuthenticated: isDevelopment && isDevModeActive ? !!devMode : isAuthenticated
    } : null
  };
};

export default useRouteDebugger;
