
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { UserType } from '@/types/navigation';

/**
 * Simplified navigation hook with essential functionality only
 */
export const useSimpleNavigation = () => {
  const navigate = useNavigate();

  const goToHome = useCallback((userType?: UserType | null) => {
    switch (userType) {
      case 'admin':
        navigate('/admin/system-breakdown');
        break;
      case 'establishment':
        navigate('/establishment/dashboard');
        break;
      case 'promoter':
        navigate('/promoter/dashboard');
        break;
      case 'individual':
        navigate('/explore');
        break;
      default:
        navigate('/landing');
    }
  }, [navigate]);

  const goToProfile = useCallback((userType?: UserType | null) => {
    switch (userType) {
      case 'establishment':
        navigate('/establishment/profile');
        break;
      case 'promoter':
        navigate('/promoter/profile');
        break;
      default:
        navigate('/profile');
    }
  }, [navigate]);

  const goTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return {
    goToHome,
    goToProfile,
    goTo,
    navigate
  };
};
