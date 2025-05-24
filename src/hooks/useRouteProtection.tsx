
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
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
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { showError } = useDebouncedToast();
  
  // Add protection state to prevent overlapping checks
  const protectionInProgress = useRef(false);
  const lastCheckedPath = useRef<string>('');
  
  useEffect(() => {
    // Wait until auth is loaded
    if (isLoading) {
      return;
    }
    
    // Prevent overlapping protection checks for the same path
    const currentPath = location.pathname + location.search;
    if (protectionInProgress.current || lastCheckedPath.current === currentPath) {
      return;
    }
    
    protectionInProgress.current = true;
    lastCheckedPath.current = currentPath;
    
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
      protectionInProgress.current = false;
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
        protectionInProgress.current = false;
        return;
      }
    }
    
    // If we reach here, user is authorized
    setIsAuthorized(true);
    protectionInProgress.current = false;
  }, [user, isLoading, requireAuth, allowedUserTypes, navigate, redirectTo, location.pathname, location.search, showToast, showError]);
  
  return { isAuthorized, isLoading: isLoading || isAuthorized === null };
};

export default useRouteProtection;
