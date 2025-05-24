
import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { DevAuthService } from '@/services/DevAuthService';
import { UserType } from '@/types/navigation';

/**
 * Hook that provides development mode authentication bypass functionality
 * This allows components to work with mock data when dev mode is active
 */
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

  const getMockProfile = useMemo(() => {
    if (!shouldBypass || !devMode) return null;
    return DevAuthService.getMockProfile(devMode);
  }, [shouldBypass, devMode]);

  return {
    // Effective auth state (real or mock)
    user: effectiveAuth.user,
    session: effectiveAuth.session,
    isAuthenticated: effectiveAuth.isAuthenticated,
    userType: effectiveAuth.userType as UserType,
    
    // Loading state (bypass loading in dev mode)
    isLoading: isLoading && !shouldBypass,
    
    // Dev mode specific
    isUsingDevBypass: shouldBypass,
    mockProfile: getMockProfile,
    
    // Utilities
    canAccess: (requiredUserType: UserType) => {
      return effectiveAuth.userType === requiredUserType;
    },
    
    hasPermission: (permission: string) => {
      // Basic permission system - admin has all permissions
      if (effectiveAuth.userType === 'admin') return true;
      
      // Add more granular permissions as needed
      const userPermissions: Record<UserType, string[]> = {
        admin: ['*'], // All permissions
        establishment: ['manage_cocktails', 'view_analytics', 'manage_promotions'],
        promoter: ['manage_events', 'view_analytics', 'manage_campaigns'],
        individual: ['view_content', 'create_reviews']
      };
      
      const userType = effectiveAuth.userType as UserType;
      return userPermissions[userType]?.includes(permission) || 
             userPermissions[userType]?.includes('*') || 
             false;
    }
  };
};

export default useDevAuthBypass;
