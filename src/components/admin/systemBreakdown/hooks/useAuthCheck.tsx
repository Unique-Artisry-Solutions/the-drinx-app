
import { useAuth } from '@/contexts/auth/AuthProvider';

export const useAuthCheck = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    handleLogout
  };
};
