import { useState, useEffect, useCallback } from 'react';
import { DevAutoLoginService, TestUserType } from '@/services/DevAutoLoginService';
import { useAuth } from '@/contexts/auth/AuthProvider';

export interface DevAutoLoginState {
  isDevelopmentMode: boolean;
  currentUserType: TestUserType | null;
  isAutoLoginActive: boolean;
  availableUserTypes: ReturnType<typeof DevAutoLoginService.getAvailableUserTypes>;
  isLoading: boolean;
}

export interface DevAutoLoginActions {
  switchUserType: (userType: TestUserType) => Promise<void>;
  logout: () => Promise<void>;
  initializeAutoLogin: () => Promise<void>;
}

/**
 * Hook for managing development auto-login functionality
 */
export const useDevAutoLogin = (): DevAutoLoginState & DevAutoLoginActions => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<TestUserType | null>(null);

  const isDevelopmentMode = DevAutoLoginService.isDevelopmentMode();
  const availableUserTypes = DevAutoLoginService.getAvailableUserTypes();

  // Update current user type when it changes in localStorage or auth state changes
  useEffect(() => {
    if (!isDevelopmentMode) return;

    const updateCurrentUserType = () => {
      const storedType = DevAutoLoginService.getCurrentDevUserType();
      setCurrentUserType(storedType);
    };

    // Initial check
    updateCurrentUserType();

    // Listen for storage changes (in case of multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dev_auto_login_user_type') {
        updateCurrentUserType();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isDevelopmentMode, user]);

  const switchUserType = useCallback(async (userType: TestUserType) => {
    if (!isDevelopmentMode) return;

    setIsLoading(true);
    try {
      const result = await DevAutoLoginService.switchUserType(userType);
      if (result.success) {
        setCurrentUserType(userType);
      } else {
        console.error('Failed to switch user type:', result.error);
      }
    } catch (error) {
      console.error('Error switching user type:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopmentMode]);

  const logout = useCallback(async () => {
    if (!isDevelopmentMode) return;

    setIsLoading(true);
    try {
      await DevAutoLoginService.logout();
      setCurrentUserType(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopmentMode]);

  const initializeAutoLogin = useCallback(async () => {
    if (!isDevelopmentMode) return;

    setIsLoading(true);
    try {
      await DevAutoLoginService.initializeAutoLogin();
      const storedType = DevAutoLoginService.getCurrentDevUserType();
      setCurrentUserType(storedType);
    } catch (error) {
      console.error('Error initializing auto-login:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopmentMode]);

  const isAutoLoginActive = isDevelopmentMode && !!currentUserType && !!user;

  return {
    // State
    isDevelopmentMode,
    currentUserType,
    isAutoLoginActive,
    availableUserTypes,
    isLoading: isLoading || authLoading,
    
    // Actions
    switchUserType,
    logout,
    initializeAutoLogin,
  };
};

export default useDevAutoLogin;