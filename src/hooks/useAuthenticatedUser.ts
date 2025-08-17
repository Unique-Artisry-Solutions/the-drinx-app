
import { useAuth } from '@/contexts/auth/AuthProvider';

/**
 * Hook to get the authenticated user and related auth state
 * Provides a simplified interface for components that need user data
 * Uses only real Supabase authentication - no bypasses or mocks
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

  const result = {
    user,
    session,
    isLoading,
    isAuthenticated,
    authStable,
    userType,
    // Computed properties
    isReady: authStable,
    hasValidSession: !!(user && session),
  };

  return result;
};

export default useAuthenticatedUser;
