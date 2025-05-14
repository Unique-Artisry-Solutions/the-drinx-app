
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to check if user is authenticated as admin
 * Simplified to focus only on admin authentication
 */
export const useAuthCheck = () => {
  const navigate = useNavigate();

  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      console.log('User is not authenticated as admin, redirecting to /admin');
      navigate('/admin');
    } else {
      console.log('Admin authentication verified');
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log('Admin logging out');
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  return { handleLogout };
};
