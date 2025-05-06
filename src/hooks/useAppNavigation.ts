
import { useNavigate } from 'react-router-dom';

/**
 * A custom hook for handling app navigation consistently
 * This centralizes all navigation logic to avoid refresh issues
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  
  /**
   * Navigate to the appropriate home page based on user type
   */
  const goToHomePage = (userType?: string | null) => {
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
  };
  
  /**
   * Navigate to the profile page based on user type
   */
  const goToProfilePage = (userType?: string | null) => {
    if (!userType || userType === 'individual') {
      navigate('/profile');
    } else if (userType === 'establishment') {
      navigate('/establishment/profile');
    } else if (userType === 'promoter') {
      navigate('/promoter/profile');
    }
  };
  
  /**
   * Navigate after successful login
   */
  const goToAfterLogin = (userType?: string | null, savedRedirect?: string | null) => {
    if (savedRedirect) {
      navigate(savedRedirect);
      return;
    }
    
    goToHomePage(userType);
  };
  
  /**
   * Navigate to admin dashboard
   */
  const goToAdminDashboard = () => {
    navigate('/admin/system-breakdown');
  };

  /**
   * Navigate to edit page for different entity types
   * @param entityType Type of entity being edited
   * @param id ID of the entity
   * @param preventRefresh If true, use React Router navigation to prevent page refresh
   */
  const goToEditPage = (entityType: string, id: string, preventRefresh = true) => {
    const path = `/${entityType}/edit/${id}`;
    if (preventRefresh) {
      navigate(path);
    }
    return path;
  };

  return {
    goToHomePage,
    goToProfilePage,
    goToAfterLogin,
    goToAdminDashboard,
    goToEditPage,
    navigate
  };
};
