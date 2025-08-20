
import { useAuth } from '@/contexts/auth/AuthProvider';

/**
 * Hook to get the authenticated user and related auth state
 * Provides a simplified interface for components that need user data
 * Uses only real Supabase authentication - no bypasses or mocks
 */
export const useAuthenticatedUser = () => {
  const authContext = useAuth();
  
  // Direct state consumption without local derivations to ensure consistency
  const { 
    user, 
    session, 
    isLoading, 
    isAuthenticated, 
    authStable,
    userType,
    isTransitioning,
    authStateStable
  } = authContext;

  const result = {
    user,
    session,
    isLoading,
    isAuthenticated,
    authStable,
    userType,
    isTransitioning,
    authStateStable,
    // Enhanced computed properties
    isReady: authStable && authStateStable && !isTransitioning,
    hasValidSession: !!(user && session),
  };

  return result;
};

export default useAuthenticatedUser;
