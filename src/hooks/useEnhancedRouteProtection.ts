
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
 * Enhanced route protection hook with comprehensive validation and debugging
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
    lastValidatedPath?: string;
  }>({
    isValid: null,
    isLoading: true
  });
  
  useEffect(() => {
    // Prevent redundant validation for the same path
    if (validationState.lastValidatedPath === location.pathname && validationState.isValid !== null) {
      return;
    }
    
    // Wait for all systems to initialize
    if (isLoading || !authStable || !isInitialized) {
      setValidationState(prev => ({ ...prev, isLoading: true }));
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
    
    // Validate route access with enhanced error handling
    try {
      const validation = validateRouteAccess(location.pathname, context);
      
      setValidationState({
        isValid: validation.isValid,
        isLoading: false,
        error: validation.error,
        lastValidatedPath: location.pathname
      });
      
      // Handle validation failure with improved UX
      if (!validation.isValid) {
        if (showToasts && validation.error) {
          const toastDuration = validation.error.includes('Authentication required') ? 3000 : 5000;
          debouncedToast.error('Access Denied', validation.error, toastDuration);
        }
        
        // Determine redirect with fallback chain
        let redirectTo = customFallback || validation.suggestedRedirect;
        
        // Fallback chain for better UX
        if (!redirectTo) {
          if (validation.error?.includes('Authentication required')) {
            redirectTo = '/login';
          } else if (validation.error?.includes('Route not found')) {
            redirectTo = '/404';
          } else {
            redirectTo = isAuthenticated ? (userType ? getUserTypeFallback(userType) : '/explore') : '/landing';
          }
        }
        
        // Save current path for potential redirect after auth
        if (validation.error?.includes('Authentication required')) {
          localStorage.setItem('auth_redirect', location.pathname);
        }
        
        // Enhanced logging for debugging
        if (isDevelopment) {
          console.log('useEnhancedRouteProtection: Redirecting', {
            from: location.pathname,
            to: redirectTo,
            reason: validation.error,
            context
          });
        }
        
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      console.error('useEnhancedRouteProtection: Validation error', error);
      setValidationState({
        isValid: false,
        isLoading: false,
        error: 'Route validation failed',
        lastValidatedPath: location.pathname
      });
      
      // Fallback to safe route
      navigate('/404', { replace: true });
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
    navigate,
    validationState.lastValidatedPath
  ]);
  
  // Helper function for getting user type fallback
  const getUserTypeFallback = (userType: string): string => {
    const fallbackMap: Record<string, string> = {
      admin: '/admin/system-breakdown',
      establishment: '/establishment/dashboard',
      promoter: '/promoter/dashboard',
      individual: '/explore'
    };
    return fallbackMap[userType] || '/explore';
  };
  
  return {
    isValid: validationState.isValid,
    isLoading: validationState.isLoading,
    error: validationState.error,
    lastValidatedPath: validationState.lastValidatedPath,
    canAccess: (path: string) => {
      const context: RouteValidationContext = {
        userType: isDevelopment && isDevModeActive ? devMode : userType,
        isAuthenticated: isDevelopment && isDevModeActive ? !!devMode : isAuthenticated,
        isDevelopment,
        isDevModeActive
      };
      return validateRouteAccess(path, context).isValid;
    },
    testRoute: (path: string) => {
      const context: RouteValidationContext = {
        userType: isDevelopment && isDevModeActive ? devMode : userType,
        isAuthenticated: isDevelopment && isDevModeActive ? !!devMode : isAuthenticated,
        isDevelopment,
        isDevModeActive
      };
      return validateRouteAccess(path, context);
    }
  };
};

export default useEnhancedRouteProtection;
