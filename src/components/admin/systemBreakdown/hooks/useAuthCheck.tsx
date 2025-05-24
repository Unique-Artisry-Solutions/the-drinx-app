
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to check if user is authenticated as admin
 */
export const useAuthCheck = () => {
  const navigate = useNavigate();

  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  return { handleLogout };
};
