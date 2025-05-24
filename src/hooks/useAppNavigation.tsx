
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { debouncedToast } from '@/utils/debouncedToast';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const { userType, navigationReady, isLoading, authStable } = useAuth();

  /**
   * Navigation guard to prevent redirects during auth loading states
   */
  const canNavigate = useCallback(() => {
    if (isLoading || !authStable || !navigationReady) {
      console.log("useAppNavigation - Navigation blocked:", { 
        isLoading, 
        authStable, 
        navigationReady 
      });
      return false;
    }
    return true;
  }, [isLoading, authStable, navigationReady]);

  /**
   * Navigate to the appropriate home page based on confirmed userType
   * Waits for userType to be determined before redirecting
   */
  const goToHomePage = useCallback((fallbackUserType?: string) => {
    console.log("useAppNavigation - goToHomePage called with fallback:", fallbackUserType);
    
    if (!canNavigate()) {
      console.log("useAppNavigation - Navigation not ready, deferring redirect");
      return;
    }
    
    // Use confirmed userType from auth context, not localStorage
    const confirmedUserType = userType || fallbackUserType;
    console.log("useAppNavigation - Using confirmed user type:", confirmedUserType);
    
    // Fallback handling for undefined userType scenarios
    if (!confirmedUserType) {
      console.log("useAppNavigation - No user type available, redirecting to landing");
      navigate('/landing');
      return;
    }
    
    switch (confirmedUserType) {
      case 'establishment':
        console.log("useAppNavigation - Navigating to establishment dashboard");
        navigate('/establishment/dashboard');
        break;
      case 'promoter':
        console.log("useAppNavigation - Navigating to promoter dashboard");
        navigate('/promoter/dashboard');
        break;
      case 'admin':
        console.log("useAppNavigation - Navigating to admin dashboard");
        navigate('/admin/system-breakdown');
        break;
      case 'individual':
      default:
        console.log("useAppNavigation - Navigating to explore page");
        navigate('/explore');
        break;
    }
  }, [navigate, userType, canNavigate]);

  /**
   * Navigate to the profile page based on confirmed userType
   */
  const goToProfilePage = useCallback((fallbackUserType?: string) => {
    if (!canNavigate()) {
      console.log("useAppNavigation - Profile navigation blocked");
      return;
    }

    const confirmedUserType = userType || fallbackUserType || 'individual';
    console.log("useAppNavigation - Profile navigation for user type:", confirmedUserType);
    
    switch (confirmedUserType) {
      case 'establishment':
        navigate('/establishment/profile');
        break;
      case 'promoter':
        navigate('/promoter/profile');
        break;
      case 'individual':
      default:
        navigate('/profile');
        break;
    }
  }, [navigate, userType, canNavigate]);

  /**
   * Navigate after successful login with proper auth state coordination
   */
  const goToAfterLogin = useCallback((fallbackUserType?: string, savedRedirect?: string) => {
    console.log("useAppNavigation - Post-login navigation:", { 
      fallbackUserType, 
      savedRedirect,
      navigationReady,
      userType 
    });
    
    if (!canNavigate()) {
      console.log("useAppNavigation - Post-login navigation deferred");
      // Don't show error toast - this is expected during auth loading
      return;
    }
    
    // Priority: saved redirect > user type based navigation
    if (savedRedirect && savedRedirect !== '/') {
      console.log("useAppNavigation - Using saved redirect:", savedRedirect);
      navigate(savedRedirect);
      localStorage.removeItem('auth_redirect');
      return;
    }
    
    goToHomePage(fallbackUserType);
  }, [navigate, goToHomePage, canNavigate]);

  const goToLoginPage = useCallback(() => {
    console.log("useAppNavigation - Redirecting to login page");
    navigate('/login');
  }, [navigate]);

  const goToLandingPage = useCallback(() => {
    console.log("useAppNavigation - Redirecting to landing page");
    navigate('/landing');
  }, [navigate]);

  const goToAdminDashboard = useCallback(() => {
    if (!canNavigate()) {
      debouncedToast.error(
        'Navigation Error', 
        'Please wait for authentication to complete.', 
        3000
      );
      return;
    }
    
    console.log("useAppNavigation - Redirecting to admin dashboard");
    navigate('/admin/system-breakdown');
  }, [navigate, canNavigate]);

  /**
   * Navigate to edit page with navigation guards
   */
  const goToEditPage = useCallback((entityType: string, id: string, preventRefresh = true) => {
    if (!canNavigate()) {
      debouncedToast.error(
        'Navigation Error', 
        'Please wait for the page to load completely.', 
        3000
      );
      return;
    }
    
    const path = `/${entityType}/edit/${id}`;
    if (preventRefresh) {
      navigate(path);
    }
    return path;
  }, [navigate, canNavigate]);
  
  /**
   * Navigate to a specific route with enhanced error handling
   */
  const goToRoute = useCallback((path: string, options?: { 
    replace?: boolean; 
    state?: any;
    showToast?: boolean;
    toastMessage?: string;
    toastTitle?: string;
    toastType?: 'success' | 'error' | 'info';
    bypassGuards?: boolean;
  }) => {
    // Allow bypassing guards for critical navigation (like logout)
    if (!options?.bypassGuards && !canNavigate()) {
      console.log("useAppNavigation - Route navigation blocked for path:", path);
      if (options?.showToast) {
        debouncedToast.error(
          'Navigation Error', 
          'Please wait for authentication to complete.', 
          3000
        );
      }
      return;
    }
    
    navigate(path, { replace: options?.replace, state: options?.state });
    
    if (options?.showToast && options.toastMessage) {
      const toastType = options?.toastType || 'info';
      const toastTitle = options?.toastTitle || (toastType === 'success' ? 'Success' : 
                                                toastType === 'error' ? 'Error' : 'Information');
      
      if (toastType === 'success') {
        debouncedToast.success(toastTitle, options.toastMessage, 3000);
      } else if (toastType === 'error') {
        debouncedToast.error(toastTitle, options.toastMessage, 5000);
      } else {
        debouncedToast.info(toastTitle, options.toastMessage, 3000);
      }
    }
  }, [navigate, canNavigate]);

  // Memoize the return object to prevent recreating it on every render
  return useMemo(() => ({
    goToHomePage,
    goToProfilePage,
    goToAfterLogin,
    goToLoginPage,
    goToLandingPage,
    goToAdminDashboard,
    goToEditPage,
    goToRoute,
    navigate,
    // Expose navigation state for components that need it
    canNavigate: canNavigate(),
    navigationReady,
    userType
  }), [
    goToHomePage, 
    goToProfilePage, 
    goToAfterLogin, 
    goToLoginPage, 
    goToLandingPage, 
    goToAdminDashboard,
    goToEditPage,
    goToRoute,
    navigate,
    canNavigate,
    navigationReady,
    userType
  ]);
};

export default useAppNavigation;
