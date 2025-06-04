
import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { DevAuthService } from '@/services/DevAuthService';
import { UserType } from '@/types/navigation';

export const useDevAuthBypass = () => {
  const { user, session, isAuthenticated, userType, isLoading } = useAuth();
  const { isDevelopment, isDevModeActive, devMode } = useDevelopmentMode();

  const effectiveAuth = useMemo(() => {
    return DevAuthService.getEffectiveAuthState(
      user,
      session,
      isAuthenticated,
      isDevelopment,
      isDevModeActive,
      devMode
    );
  }, [user, session, isAuthenticated, isDevelopment, isDevModeActive, devMode]);

  const shouldBypass = useMemo(() => {
    return DevAuthService.shouldBypassAuth(isDevelopment, isDevModeActive, devMode);
  }, [isDevelopment, isDevModeActive, devMode]);

  return {
    // Effective auth state
    user: effectiveAuth.user,
    session: effectiveAuth.session,
    isAuthenticated: effectiveAuth.isAuthenticated,
    userType: effectiveAuth.userType as UserType,
    
    // Loading state
    isLoading: isLoading && !shouldBypass,
    
    // Dev mode info
    isUsingDevBypass: shouldBypass,
    
    // Utilities
    canAccess: (requiredUserType: UserType) => {
      return effectiveAuth.userType === requiredUserType;
    }
  };
};

export default useDevAuthBypass;
