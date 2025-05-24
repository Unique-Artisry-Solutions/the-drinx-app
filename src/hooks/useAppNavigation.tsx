
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goToHomePage = useCallback((userType?: string) => {
    console.log("useAppNavigation - goToHomePage called with userType:", userType);
    
    // Check if admin is logged in through regular auth system
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    
    if (isAdmin) {
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
  }, [navigate]);

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
    navigate('/admin/system-breakdown');
  }, [navigate]);

  // Memoize the return object to prevent recreating it on every render
  return useMemo(() => ({
    goToHomePage,
    goToLoginPage,
    goToLandingPage,
    goToAdminDashboard
  }), [goToHomePage, goToLoginPage, goToLandingPage, goToAdminDashboard]);
};
