import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuthenticatedUser } from './useAuthenticatedUser';
import { UserType } from '@/types/navigation/NavigationTypes';

/**
 * Hook that provides auth state with development mode bypass
 * This allows breadcrumbs and navigation to work correctly in dev mode
 */
export const useDevAuthBypass = () => {
  const { isDevelopment, isDevModeActive, devMode } = useDevelopmentMode();
  const { userType: authUserType, isAuthenticated: authIsAuthenticated } = useAuthenticatedUser();

  // In development mode with dev mode active, use dev settings
  if (isDevelopment && isDevModeActive && devMode) {
    return {
      userType: devMode as UserType,
      isAuthenticated: true,
      isDevelopment,
      isDevModeActive
    };
  }

  // Otherwise use auth state
  return {
    userType: authUserType,
    isAuthenticated: authIsAuthenticated,
    isDevelopment,
    isDevModeActive
  };
};

export default useDevAuthBypass;
