
import { useAuth } from './useAuth';

// Enhanced compatibility bridge for useDevAuthBypass
export const useDevAuthBypass = () => {
  const auth = useAuth();
  
  return {
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    isUsingDevBypass: auth.isUsingDevBypass,
    isLoading: auth.isLoading,
    user: auth.user // Add user property that some components expect
  };
};

// Also export as default for components that import it that way
export default useDevAuthBypass;
