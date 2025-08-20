
import { useAuth } from '@/contexts/auth/AuthProvider';
import { getCurrentUserId } from '@/utils/impersonationAuth';
import { useState, useEffect } from 'react';

/**
 * Hook to get the authenticated user and related auth state
 * Provides a simplified interface for components that need user data
 * Uses only real Supabase authentication - no bypasses or mocks
 * Enhanced with impersonation awareness for admin testing
 */
export const useAuthenticatedUser = () => {
  const authContext = useAuth();
  const [impersonationUserId, setImpersonationUserId] = useState<string | null>(null);
  
  // Check for impersonation state on mount and auth changes
  useEffect(() => {
    const checkImpersonation = async () => {
      try {
        const authResult = await getCurrentUserId();
        if (authResult.isImpersonating && authResult.userId) {
          setImpersonationUserId(authResult.userId);
          console.log('🎭 Impersonation detected in useAuthenticatedUser:', {
            impersonatedUserId: authResult.userId,
            originalUserId: authContext.user?.id
          });
        } else {
          setImpersonationUserId(null);
        }
      } catch (error) {
        console.error('❌ Error checking impersonation in useAuthenticatedUser:', error);
        setImpersonationUserId(null);
      }
    };

    if (authContext.authStable && authContext.authStateStable) {
      checkImpersonation();
    }
  }, [authContext.user, authContext.authStable, authContext.authStateStable]);
  
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
    // Enhanced computed properties with impersonation awareness
    isReady: authStable && authStateStable && !isTransitioning,
    hasValidSession: !!(user && session),
    // Add impersonation info for debugging
    impersonationUserId,
    isImpersonating: !!impersonationUserId,
    effectiveUserId: impersonationUserId || user?.id || null,
  };

  return result;
};

export default useAuthenticatedUser;
