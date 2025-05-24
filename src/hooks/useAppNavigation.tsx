
import { useNavigate } from 'react-router-dom';
import { checkAdminBypassStatus } from '@/utils/adminBypass';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goToHomePage = (userType?: string) => {
    console.log("useAppNavigation - goToHomePage called with userType:", userType);
    
    // Check for admin bypass first
    const { isEnabled: isAdminBypass, userType: bypassType } = checkAdminBypassStatus();
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    
    if (isAdminBypass || isAdmin) {
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
  };

  const goToLoginPage = () => {
    console.log("useAppNavigation - Redirecting to login page");
    navigate('/login');
  };

  const goToLandingPage = () => {
    console.log("useAppNavigation - Redirecting to landing page");
    navigate('/landing');
  };

  return {
    goToHomePage,
    goToLoginPage,
    goToLandingPage
  };
};
