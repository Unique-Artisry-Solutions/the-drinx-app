
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { DevAuthService } from '@/services/DevAuthService';

/**
 * Hook to get the authenticated user and related auth state
 * Provides a simplified interface for components that need user data
 * Includes development mode bypass functionality
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
  
  const { isDevelopment, isDevModeActive, devMode } = useDevelopmentMode();

  // Get effective auth state with dev bypass
  const effectiveAuth = DevAuthService.getEffectiveAuthState(
    user,
    session,
    isAuthenticated,
    isDevelopment,
    isDevModeActive,
    devMode
  );

  return {
    user: effectiveAuth.user,
    session: effectiveAuth.session,
    isLoading: isLoading && !DevAuthService.shouldBypassAuth(isDevelopment, isDevModeActive, devMode),
    isAuthenticated: effectiveAuth.isAuthenticated,
    authStable,
    userType: effectiveAuth.userType,
    // Computed properties
    isReady: authStable && !isLoading,
    hasValidSession: !!(effectiveAuth.user && effectiveAuth.session),
    // Dev mode info
    isUsingDevBypass: DevAuthService.shouldBypassAuth(isDevelopment, isDevModeActive, devMode)
  };
};

export default useAuthenticatedUser;
