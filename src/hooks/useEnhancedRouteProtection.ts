
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { validateRouteAccess, debugRoute, RouteValidationContext } from '@/utils/routeValidation';
import { debouncedToast } from '@/utils/debouncedToast';

interface EnhancedRouteProtectionOptions {
  enableDebug?: boolean;
  showToasts?: boolean;
  customFallback?: string;
}

/**
 * Enhanced route protection hook with validation and debugging
 */
export const useEnhancedRouteProtection = (
  options: EnhancedRouteProtectionOptions = {}
) => {
  const { enableDebug = false, showToasts = true, customFallback } = options;
  const location = useLocation();
  const navigate = useNavigate();
  const { userType, isAuthenticated, isLoading, authStable } = useAuth();
  const { isDevelopment, isDevModeActive, devMode, isInitialized } = useDevelopmentMode();
  
  const [validationState, setValidationState] = useState<{
    isValid: boolean | null;
    isLoading: boolean;
    error?: string;
  }>({
    isValid: null,
    isLoading: true
  });
  
  useEffect(() => {
    // Wait for all systems to initialize
    if (isLoading || !authStable || !isInitialized) {
      return;
    }
    
    const context: RouteValidationContext = {
      userType: isDevelopment && isDevModeActive ? devMode : userType,
      isAuthenticated: isDevelopment && isDevModeActive ? !!devMode : isAuthenticated,
      isDevelopment,
      isDevModeActive
    };
    
    // Debug route if enabled
    if (enableDebug || isDevelopment) {
      debugRoute(location.pathname, context);
    }
    
    // Validate route access
    const validation = validateRouteAccess(location.pathname, context);
    
    setValidationState({
      isValid: validation.isValid,
      isLoading: false,
      error: validation.error
    });
    
    // Handle validation failure
    if (!validation.isValid) {
      if (showToasts && validation.error) {
        debouncedToast.error('Access Denied', validation.error, 5000);
      }
      
      const redirectTo = customFallback || validation.suggestedRedirect || '/';
      
      // Save current path for potential redirect after auth
      if (validation.error?.includes('Authentication required')) {
        localStorage.setItem('auth_redirect', location.pathname);
      }
      
      navigate(redirectTo, { replace: true });
    }
  }, [
    location.pathname,
    userType,
    isAuthenticated,
    isLoading,
    authStable,
    isDevelopment,
    isDevModeActive,
    devMode,
    isInitialized,
    enableDebug,
    showToasts,
    customFallback,
    navigate
  ]);
  
  return {
    isValid: validationState.isValid,
    isLoading: validationState.isLoading,
    error: validationState.error,
    canAccess: (path: string) => {
      const context: RouteValidationContext = {
        userType: isDevelopment && isDevModeActive ? devMode : userType,
        isAuthenticated: isDevelopment && isDevModeActive ? !!devMode : isAuthenticated,
        isDevelopment,
        isDevModeActive
      };
      return validateRouteAccess(path, context).isValid;
    }
  };
};

export default useEnhancedRouteProtection;
