
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuthenticatedUser } from './useAuthenticatedUser';
import { UserType } from '@/types/navigation/NavigationTypes';

/**
 * Hook that provides auth state with development mode bypass
 * This allows breadcrumbs and navigation to work correctly in dev mode
 */
export const useDevAuthBypass = () => {
  const { isDevelopment, isDevModeActive, devMode } = useDevelopmentMode();
  const { userType: authUserType, isAuthenticated: authIsAuthenticated, user, isLoading } = useAuthenticatedUser();

  // In development mode with dev mode active, use dev settings (localhost only)
  const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
  if (isDevelopment && isDevModeActive && devMode && isLocalhost) {
    return {
      userType: devMode as UserType,
      isAuthenticated: true,
      isDevelopment,
      isDevModeActive,
      user: user || null, // Pass through the actual user if available
      isUsingDevBypass: true,
      isLoading: false // When using dev bypass, we're not loading
    };
  }

  // Otherwise use auth state
  return {
    userType: authUserType,
    isAuthenticated: authIsAuthenticated,
    isDevelopment,
    isDevModeActive,
    user: user || null,
    isUsingDevBypass: false,
    isLoading: isLoading || false
  };
};

export default useDevAuthBypass;
