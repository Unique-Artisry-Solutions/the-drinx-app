
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { DevAuthService } from '@/services/DevAuthService';
import { initDebug } from '@/utils/initDebug';

/**
 * Hook to get the authenticated user and related auth state
 * Provides a simplified interface for components that need user data
 * Includes development mode bypass functionality - simplified and robust
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

  initDebug.log('useAuthenticatedUser called', { 
    user: !!user, 
    session: !!session, 
    isLoading, 
    isAuthenticated, 
    authStable, 
    userType,
    isDevelopment,
    isDevModeActive,
    devMode
  });

  // Get effective auth state with dev bypass - simplified
  const effectiveAuth = DevAuthService.getEffectiveAuthState(
    user,
    session,
    isAuthenticated,
    isDevelopment,
    isDevModeActive,
    devMode
  );

  const shouldBypass = DevAuthService.shouldBypassAuth(isDevelopment, isDevModeActive, devMode);
  
  // Simplified loading state - don't get stuck in loading if using dev bypass
  const effectiveIsLoading = shouldBypass ? false : isLoading;
  
  // Simplified ready state - auth is ready if stable or using dev bypass
  const isReady = authStable || shouldBypass;

  const result = {
    user: effectiveAuth.user,
    session: effectiveAuth.session,
    isLoading: effectiveIsLoading,
    isAuthenticated: effectiveAuth.isAuthenticated,
    authStable,
    userType: effectiveAuth.userType,
    // Computed properties
    isReady,
    hasValidSession: !!(effectiveAuth.user && effectiveAuth.session),
    // Dev mode info
    isUsingDevBypass: shouldBypass
  };

  initDebug.log('useAuthenticatedUser result', result);
  return result;
};

export default useAuthenticatedUser;
