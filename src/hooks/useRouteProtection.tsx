
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDebouncedToast } from '@/hooks/useDebouncedToast';

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
  const { user, isLoading, authStable } = useAuth();
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
    // Wait until auth is loaded and stable
    if (isLoading || !authStable) {
      return;
    }
    
    // Prevent overlapping protection checks for the same state
    const currentPath = location.pathname + location.search;
    const currentUserId = user?.id || null;
    const currentAuthState = !!user;
    
    if (
      protectionInProgress.current || 
      (lastCheckedPath.current === currentPath && 
       lastCheckedUser.current === currentUserId &&
       lastCheckedAuthState.current === currentAuthState)
    ) {
      return;
    }
    
    // Set protection in progress flag
    protectionInProgress.current = true;
    lastCheckedPath.current = currentPath;
    lastCheckedUser.current = currentUserId;
    lastCheckedAuthState.current = currentAuthState;
    
    console.log('Route protection: Checking access for', currentPath, 'user:', !!user, 'authStable:', authStable);
    
    // Clear any existing cleanup timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
    
    // Check if auth is required and user is not logged in
    if (requireAuth && !user) {
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
    if (user && allowedUserTypes.length > 0) {
      const userType = localStorage.getItem('user_type');
      const isAllowedType = !userType || allowedUserTypes.includes(userType);
      
      setIsAuthorized(isAllowedType);
      
      if (!isAllowedType) {
        if (showToast) {
          showError(
            "Access denied", 
            "You don't have permission to access this page"
          );
        }
        
        // Redirect to appropriate page based on user type
        if (userType === 'establishment') {
          navigate('/establishment/dashboard', { replace: true });
        } else if (userType === 'promoter') {
          navigate('/promoter/dashboard', { replace: true });
        } else if (userType === 'admin') {
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
    setIsAuthorized(true);
    
    // Reset protection flag with cleanup
    cleanupTimeoutRef.current = setTimeout(() => {
      protectionInProgress.current = false;
    }, 100);
  }, [user, isLoading, authStable, requireAuth, allowedUserTypes, navigate, redirectTo, location.pathname, location.search, showToast, showError]);
  
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
  
  return { 
    isAuthorized, 
    isLoading: isLoading || !authStable || isAuthorized === null 
  };
};

export default useRouteProtection;
