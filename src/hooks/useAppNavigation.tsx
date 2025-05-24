
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { checkAdminBypassStatus } from '@/utils/adminBypass';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  // Memoize admin status to prevent unnecessary checks
  const adminStatus = useMemo(() => {
    const { isEnabled: isAdminBypass, userType: bypassType } = checkAdminBypassStatus();
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    return { isAdminBypass, bypassType, isAdmin };
  }, []);

  const goToHomePage = useCallback((userType?: string) => {
    console.log("useAppNavigation - goToHomePage called with userType:", userType);
    
    // Use memoized admin status
    if (adminStatus.isAdminBypass || adminStatus.isAdmin) {
      console.log("useAppNavigation - Redirecting to admin dashboard");
      navigate('/admin/system-breakdown');
      return;
    }
    
    // Get user type from parameter or localStorage
    const finalUserType = userType || localStorage.getItem('user_type') || 'individual';
    console.log("useAppNavigation - Final user type determined:", finalUserType);
    
    switch (finalUserType) {
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
  }, [navigate, adminStatus]);

  const goToLoginPage = useCallback(() => {
    console.log("useAppNavigation - Redirecting to login page");
    navigate('/login');
  }, [navigate]);

  const goToLandingPage = useCallback(() => {
    console.log("useAppNavigation - Redirecting to landing page");
    navigate('/landing');
  }, [navigate]);

  // Memoize the return object to prevent recreating it on every render
  return useMemo(() => ({
    goToHomePage,
    goToLoginPage,
    goToLandingPage
  }), [goToHomePage, goToLoginPage, goToLandingPage]);
};
