
import { useAuth } from '@/contexts/auth/AuthProvider';

/**
 * Hook to get the authenticated user and related auth state
 * Provides a simplified interface for components that need user data
 */
export const useAuthenticatedUser = () => {
  const { 
    user, 
    session, 
    isLoading, 
    isAuthenticated, 
    authStable,
    userType 
  } = useAuth();

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    authStable,
    userType,
    // Computed properties
    isReady: authStable && !isLoading,
    hasValidSession: !!(user && session)
  };
};

export default useAuthenticatedUser;
