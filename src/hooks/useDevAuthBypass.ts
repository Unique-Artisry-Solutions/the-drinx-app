
import { useState, useEffect } from 'react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin' | null;

interface DevAuthBypassState {
  userType: UserType;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useDevAuthBypass = () => {
  const { isDevelopment, devMode, isInitialized } = useDevelopmentMode();
  const [authState, setAuthState] = useState<DevAuthBypassState>({
    userType: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    if (!isInitialized) return;

    if (isDevelopment) {
      // In development mode, use the dev mode setting
      const userType = devMode;
      const isAuthenticated = userType !== null;
      
      setAuthState({
        userType,
        isAuthenticated,
        isLoading: false
      });
    } else {
      // In production, implement actual auth logic here
      // For now, default to guest state
      setAuthState({
        userType: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, [isDevelopment, devMode, isInitialized]);

  return authState;
};
