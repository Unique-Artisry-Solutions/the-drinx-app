
import { useAuth } from './useAuth';

// Compatibility bridge for useAuthLoadingStates
export const useAuthLoadingStates = () => {
  const auth = useAuth();
  
  return {
    isLoading: auth.isLoading,
    isReady: auth.isReady,
    authStable: auth.authStable
  };
};
