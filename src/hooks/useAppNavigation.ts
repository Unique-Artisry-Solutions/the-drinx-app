
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { debouncedToast } from '@/utils/debouncedToast';

/**
 * A custom hook for handling app navigation consistently
 * This centralizes all navigation logic to avoid refresh issues
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  
  /**
   * Navigate to the appropriate home page based on user type
   */
  const goToHomePage = useCallback((userType?: string | null) => {
    if (!userType) {
      navigate('/landing');
      return;
    }
    
    switch (userType) {
      case 'establishment':
        navigate('/establishment/dashboard');
        break;
      case 'promoter':
        navigate('/promoter/dashboard');
        break;
      case 'admin':
        navigate('/admin/system-breakdown');
        break;
      default:
        navigate('/explore');
    }
  }, [navigate]);
  
  /**
   * Navigate to the profile page based on user type
   */
  const goToProfilePage = useCallback((userType?: string | null) => {
    if (!userType || userType === 'individual') {
      navigate('/profile');
    } else if (userType === 'establishment') {
      navigate('/establishment/profile');
    } else if (userType === 'promoter') {
      navigate('/promoter/profile');
    }
  }, [navigate]);
  
  /**
   * Navigate after successful login
   */
  const goToAfterLogin = useCallback((userType?: string | null, savedRedirect?: string | null) => {
    if (savedRedirect) {
      navigate(savedRedirect);
      return;
    }
    
    goToHomePage(userType);
  }, [navigate, goToHomePage]);

  /**
   * Navigate to login page
   */
  const goToLoginPage = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  /**
   * Navigate to landing page
   */
  const goToLandingPage = useCallback(() => {
    navigate('/landing');
  }, [navigate]);
  
  /**
   * Navigate to admin dashboard
   */
  const goToAdminDashboard = useCallback(() => {
    navigate('/admin/system-breakdown');
  }, [navigate]);

  /**
   * Navigate to edit page for different entity types
   * @param entityType Type of entity being edited
   * @param id ID of the entity
   * @param preventRefresh If true, use React Router navigation to prevent page refresh
   */
  const goToEditPage = useCallback((entityType: string, id: string, preventRefresh = true) => {
    const path = `/${entityType}/edit/${id}`;
    if (preventRefresh) {
      navigate(path);
    }
    return path;
  }, [navigate]);
  
  /**
   * Navigate to a specific route with optional toast notification
   */
  const goToRoute = useCallback((path: string, options?: { 
    replace?: boolean; 
    state?: any;
    showToast?: boolean;
    toastMessage?: string;
    toastTitle?: string;
    toastType?: 'success' | 'error' | 'info'
  }) => {
    navigate(path, { replace: options?.replace, state: options?.state });
    
    if (options?.showToast && options.toastMessage) {
      const toastType = options?.toastType || 'info';
      const toastTitle = options?.toastTitle || (toastType === 'success' ? 'Success' : 
                                                toastType === 'error' ? 'Error' : 'Information');
      
      if (toastType === 'success') {
        debouncedToast.success(toastTitle, options.toastMessage);
      } else if (toastType === 'error') {
        debouncedToast.error(toastTitle, options.toastMessage);
      } else {
        debouncedToast.info(toastTitle, options.toastMessage);
      }
    }
  }, [navigate]);

  return {
    goToHomePage,
    goToProfilePage,
    goToAfterLogin,
    goToLoginPage,
    goToLandingPage,
    goToAdminDashboard,
    goToEditPage,
    goToRoute,
    navigate
  };
};

export default useAppNavigation;
