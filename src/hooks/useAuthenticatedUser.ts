
import { useAuth } from './useAuth';

// Compatibility bridge for useAuthenticatedUser
export const useAuthenticatedUser = () => {
  const auth = useAuth();
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    userType: auth.userType
  };
};
