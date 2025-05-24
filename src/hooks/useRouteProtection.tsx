import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDebouncedToast } from '@/hooks/useDebouncedToast';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

interface RouteProtectionOptions {
  requireAuth?: boolean;
  allowedUserTypes?: string[];
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Hook for protecting routes based on authentication and user type
 */
export const useRouteProtection = ({
  requireAuth = true,
  allowedUserTypes = [],
  redirectTo = '/login',
  showToast = true
}: RouteProtectionOptions = {}) => {
  const { user, session, isLoading, authStable, userType } = useAuth();
  const { isDevModeActive, devMode, isDevelopment, isInitialized } = useDevelopmentMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { showError } = useDebouncedToast();
  
  // Protection state to prevent overlapping checks
  const protectionInProgress = useRef(false);
  const lastCheckedPath = useRef<string>('');
  const lastCheckedUser = useRef<string | null>(null);
  const lastCheckedAuthState = useRef<boolean>(false);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoize the protection check to prevent unnecessary re-runs
  const checkProtection = useCallback(() => {
    const debugInfo = {
      path: location.pathname,
      isDevModeActive,
      devMode,
      isDevelopment,
      isInitialized,
      requireAuth,
      allowedUserTypes,
      isLoading,
      authStable,
      hasUser: !!user,
      hasSession: !!session,
      userType
    };
    
    console.log('useRouteProtection - checkProtection called:', debugInfo);
    
    // Wait for development mode initialization
    if (!isInitialized) {
      console.log('useRouteProtection: Waiting for development mode initialization');
      return;
    }
    
    // EARLY RETURN: In development mode, bypass all protection checks
    if (isDevelopment && isDevModeActive) {
      console.log('useRouteProtection: Development mode active - BYPASSING ALL CHECKS', {
        devMode,
        bypassingForPath: location.pathname
      });
      setIsAuthorized(true);
      return;
    }
    
    // Wait until auth is loaded and stable (only for non-dev mode)
    if (isLoading || !authStable) {
      console.log('useRouteProtection: Waiting for auth to stabilize');
      return;
    }
    
    // Prevent overlapping protection checks for the same state
    const currentPath = location.pathname + location.search;
    const currentUserId = user?.id || null;
    const currentAuthState = !!(user && session);
    
    if (
      protectionInProgress.current || 
      (lastCheckedPath.current === currentPath && 
       lastCheckedUser.current === currentUserId &&
       lastCheckedAuthState.current === currentAuthState)
    ) {
      console.log('useRouteProtection: Skipping duplicate check');
      return;
    }
    
    // Set protection in progress flag
    protectionInProgress.current = true;
    lastCheckedPath.current = currentPath;
    lastCheckedUser.current = currentUserId;
    lastCheckedAuthState.current = currentAuthState;
    
    console.log('useRouteProtection: Performing auth check for', currentPath);
    
    // Clear any existing cleanup timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
    
    // Check if auth is required and user is not logged in
    if (requireAuth && (!user || !session)) {
      console.log('useRouteProtection: Auth required but user not authenticated');
      setIsAuthorized(false);
      
      if (showToast) {
        showError(
          "Authentication required", 
          "Please log in to access this page"
        );
      }
      
      // Save the current path for redirect after login
      const returnPath = location.pathname + location.search;
      const currentSaved = localStorage.getItem('auth_redirect');
      if (currentSaved !== returnPath) {
        localStorage.setItem('auth_redirect', returnPath);
      }
      
      navigate(redirectTo, { replace: true });
      
      // Reset protection flag with cleanup
      cleanupTimeoutRef.current = setTimeout(() => {
        protectionInProgress.current = false;
      }, 100);
      return;
    }
    
    // Check for user type restrictions
    if ((user && session) && allowedUserTypes.length > 0) {
      const currentUserType = userType || 'individual';
      const isAllowedType = allowedUserTypes.includes(currentUserType);
      
      console.log('useRouteProtection: Checking user type restrictions', {
        currentUserType,
        allowedUserTypes,
        isAllowedType
      });
      
      setIsAuthorized(isAllowedType);
      
      if (!isAllowedType) {
        if (showToast) {
          showError(
            "Access denied", 
            "You don't have permission to access this page"
          );
        }
        
        // Redirect to appropriate page based on user type
        if (currentUserType === 'establishment') {
          navigate('/establishment/dashboard', { replace: true });
        } else if (currentUserType === 'promoter') {
          navigate('/promoter/dashboard', { replace: true });
        } else if (currentUserType === 'admin') {
          navigate('/admin/system-breakdown', { replace: true });
        } else {
          navigate('/explore', { replace: true });
        }
        
        // Reset protection flag with cleanup
        cleanupTimeoutRef.current = setTimeout(() => {
          protectionInProgress.current = false;
        }, 100);
        return;
      }
    }
    
    // If we reach here, user is authorized
    console.log('useRouteProtection: User authorized for', currentPath);
    setIsAuthorized(true);
    
    // Reset protection flag with cleanup
    cleanupTimeoutRef.current = setTimeout(() => {
      protectionInProgress.current = false;
    }, 100);
  }, [user, session, isLoading, authStable, userType, requireAuth, allowedUserTypes, navigate, redirectTo, location.pathname, location.search, showToast, showError, isDevModeActive, devMode, isDevelopment, isInitialized]);
  
  // Use effect with stable dependencies and cleanup
  useEffect(() => {
    checkProtection();
    
    // Cleanup function to reset protection state
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, [checkProtection]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      protectionInProgress.current = false;
    };
  }, []);
  
  const isLoadingState = isLoading || !authStable || isAuthorized === null || !isInitialized;
  
  console.log('useRouteProtection - Final state:', {
    isAuthorized,
    isLoadingState,
    isDevModeActive,
    path: location.pathname
  });
  
  return { 
    isAuthorized, 
    isLoading: isLoadingState
  };
};

export default useRouteProtection;
