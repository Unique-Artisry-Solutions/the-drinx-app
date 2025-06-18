
import { useState, useEffect } from 'react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { UserType, AuthenticatedUserType } from '@/types/auth';

interface DevAuthBypassState {
  userType: UserType;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUsingDevBypass: boolean;
  user: any | null;
  session: any | null;
}

export const useDevAuthBypass = () => {
  const { isDevelopment, devMode, isInitialized } = useDevelopmentMode();
  const [authState, setAuthState] = useState<DevAuthBypassState>({
    userType: null,
    isAuthenticated: false,
    isLoading: true,
    isUsingDevBypass: false,
    user: null,
    session: null
  });

  useEffect(() => {
    if (!isInitialized) return;

    if (isDevelopment && devMode) {
      // In development mode with dev mode active, use the dev mode setting
      const mockUser = {
        id: `dev-user-${devMode}`,
        email: `test@${devMode}.com`,
        user_metadata: {
          user_type: devMode,
          name: `Test ${devMode.charAt(0).toUpperCase() + devMode.slice(1)}`
        }
      };

      const mockSession = {
        user: mockUser,
        access_token: 'dev-token',
        refresh_token: 'dev-refresh-token'
      };
      
      setAuthState({
        userType: devMode as AuthenticatedUserType,
        isAuthenticated: true,
        isLoading: false,
        isUsingDevBypass: true,
        user: mockUser,
        session: mockSession
      });
    } else {
      // In production or when dev mode is not active
      setAuthState({
        userType: null,
        isAuthenticated: false,
        isLoading: false,
        isUsingDevBypass: false,
        user: null,
        session: null
      });
    }
  }, [isDevelopment, devMode, isInitialized]);

  return authState;
};
