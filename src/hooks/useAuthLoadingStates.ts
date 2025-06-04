
import { useAuth } from './useAuth';

// Enhanced compatibility bridge for useAuthLoadingStates
export const useAuthLoadingStates = (userType?: string) => {
  const auth = useAuth();
  
  return {
    isLoading: auth.isLoading,
    isReady: auth.isReady,
    authStable: auth.authStable,
    // Additional properties that some components expect
    setSigningUp: (value: boolean) => {}, // Mock function that accepts boolean parameter
    shouldPreventInteraction: () => auth.isLoading,
    getLoadingMessage: () => auth.isLoading ? "Loading..." : "",
    loadingStates: {
      signingUp: false,
      signingIn: false,
      signingOut: false
    }
  };
};
