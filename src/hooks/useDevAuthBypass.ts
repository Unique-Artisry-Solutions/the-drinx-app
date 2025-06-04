
import { useAuth } from './useAuth';

// Compatibility bridge for useDevAuthBypass
export const useDevAuthBypass = () => {
  const auth = useAuth();
  
  return {
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    isUsingDevBypass: auth.isUsingDevBypass,
    isLoading: auth.isLoading
  };
};
