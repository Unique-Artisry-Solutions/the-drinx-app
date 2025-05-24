
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { debouncedToast } from '@/utils/debouncedToast';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const { userType: authUserType } = useAuth();
  const { devMode, isDevModeActive, isDevelopment, isStateStable } = useDevelopmentMode();

  // Determine effective user type
  const effectiveUserType = useMemo(() => {
    return isDevelopment && isDevModeActive && isStateStable ? devMode : authUserType;
  }, [isDevelopment, isDevModeActive, isStateStable, devMode, authUserType]);

  /**
   * Navigate to the appropriate home page based on userType
   */
  const goToHomePage = useCallback((fallbackUserType?: string) => {
    const confirmedUserType = effectiveUserType || fallbackUserType;
    console.log("useAppNavigation - Using confirmed user type:", confirmedUserType);
    
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
        navigate('/admin/dashboard');
        break;
      case 'individual':
      default:
        console.log("useAppNavigation - Navigating to explore page");
        navigate('/explore');
        break;
    }
  }, [navigate, effectiveUserType]);

  /**
   * Navigate to the profile page based on userType
   */
  const goToProfilePage = useCallback((fallbackUserType?: string) => {
    const confirmedUserType = effectiveUserType || fallbackUserType || 'individual';
    console.log("useAppNavigation - Profile navigation for user type:", confirmedUserType);
    
    switch (confirmedUserType) {
      case 'establishment':
        navigate('/establishment/profile');
        break;
      case 'promoter':
        navigate('/promoter/profile');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'individual':
      default:
        navigate('/profile');
        break;
    }
  }, [navigate, effectiveUserType]);

  /**
   * Navigate after successful login with proper auth state coordination
   */
  const goToAfterLogin = useCallback((fallbackUserType?: string, savedRedirect?: string) => {
    console.log("useAppNavigation - Post-login navigation:", { 
      fallbackUserType, 
      savedRedirect,
      effectiveUserType,
      isDevelopment,
      isDevModeActive
    });
    
    // Priority: saved redirect > user type based navigation
    if (savedRedirect && savedRedirect !== '/') {
      console.log("useAppNavigation - Using saved redirect:", savedRedirect);
      navigate(savedRedirect);
      localStorage.removeItem('auth_redirect');
      return;
    }
    
    goToHomePage(fallbackUserType);
  }, [navigate, goToHomePage, effectiveUserType, isDevelopment, isDevModeActive]);

  const goToLoginPage = useCallback(() => {
    console.log("useAppNavigation - Redirecting to login page");
    navigate('/login');
  }, [navigate]);

  const goToLandingPage = useCallback(() => {
    console.log("useAppNavigation - Redirecting to landing page");
    navigate('/landing');
  }, [navigate]);

  const goToAdminDashboard = useCallback(() => {
    console.log("useAppNavigation - Redirecting to admin dashboard");
    navigate('/admin/dashboard');
  }, [navigate]);

  /**
   * Navigate to edit page
   */
  const goToEditPage = useCallback((entityType: string, id: string, preventRefresh = true) => {
    const path = `/${entityType}/edit/${id}`;
    if (preventRefresh) {
      navigate(path);
    }
    return path;
  }, [navigate]);

  /**
   * Navigate to a specific route
   */
  const goToRoute = useCallback((path: string, options?: { 
    replace?: boolean; 
    state?: any;
    showToast?: boolean;
    toastMessage?: string;
    toastTitle?: string;
    toastType?: 'success' | 'error' | 'info';
  }) => {
    navigate(path, { replace: options?.replace, state: options?.state });
    
    if (options?.showToast && options.toastMessage) {
      const toastType = options?.toastType || 'info';
      const toastTitle = options?.toastTitle || (toastType === 'success' ? 'Success' : 
                                                toastType === 'error' ? 'Error' : 'Information');
      
      if (toastType === 'success') {
        debouncedToast.success(toastTitle, options.toastMessage, { duration: 3000 });
      } else if (toastType === 'error') {
        debouncedToast.error(toastTitle, options.toastMessage, { duration: 5000 });
      } else {
        debouncedToast.info(toastTitle, options.toastMessage, { duration: 3000 });
      }
    }
  }, [navigate]);

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
    userType: effectiveUserType
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
    effectiveUserType
  ]);
};

export default useAppNavigation;
