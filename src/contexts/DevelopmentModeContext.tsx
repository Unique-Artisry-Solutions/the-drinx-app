
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TEST_CREDENTIALS } from '@/components/auth/constants/testUsers';
import { debouncedToast } from '@/utils/debouncedToast';

export type TestUserType = 'individual' | 'establishment' | 'promoter' | 'admin';
export type DevUserType = TestUserType | null;

interface DevelopmentModeContextType {
  isDevelopment: boolean;
  devMode: DevUserType;
  switchToUserType: (userType: DevUserType) => Promise<void>;
  exitDevMode: () => Promise<void>;
  isDevModeActive: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  availableUserTypes: Array<{
    type: TestUserType;
    label: string;
    credentials: typeof TEST_CREDENTIALS.individual;
  }>;
}

const DevelopmentModeContext = createContext<DevelopmentModeContextType | undefined>(undefined);

export const DevelopmentModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [devMode, setDevMode] = useState<DevUserType>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Development mode detection
  const checkDevelopmentMode = useCallback(() => {
    return process.env.NODE_ENV === 'development' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname.includes('lovableproject.com');
  }, []);

  // Storage helpers
  const getCurrentDevUserType = useCallback((): TestUserType | null => {
    if (!checkDevelopmentMode()) return null;
    const stored = localStorage.getItem('dev_auto_login_user_type');
    return stored as TestUserType | null;
  }, [checkDevelopmentMode]);

  const setCurrentDevUserType = useCallback((userType: TestUserType | null) => {
    if (!checkDevelopmentMode()) return;
    if (userType) {
      localStorage.setItem('dev_auto_login_user_type', userType);
    } else {
      localStorage.removeItem('dev_auto_login_user_type');
    }
  }, [checkDevelopmentMode]);

  // Available user types
  const availableUserTypes = [
    {
      type: 'individual' as TestUserType,
      label: 'Individual User',
      credentials: TEST_CREDENTIALS.individual
    },
    {
      type: 'establishment' as TestUserType,
      label: 'Business Owner',
      credentials: TEST_CREDENTIALS.establishment
    },
    {
      type: 'promoter' as TestUserType,
      label: 'Event Promoter',
      credentials: TEST_CREDENTIALS.promoter
    },
    {
      type: 'admin' as TestUserType,
      label: 'Administrator',
      credentials: TEST_CREDENTIALS.admin
    }
  ];

  // Auto-login functionality
  const autoLogin = useCallback(async (userType: TestUserType): Promise<{ success: boolean; error?: string }> => {
    if (!checkDevelopmentMode()) {
      return { success: false, error: 'Not in development mode' };
    }

    const credentials = TEST_CREDENTIALS[userType];
    if (!credentials) {
      return { success: false, error: `No credentials found for user type: ${userType}` };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Auto-login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setCurrentDevUserType(userType);
        console.log(`Auto-login successful for ${userType}:`, credentials.email);
        return { success: true };
      }

      return { success: false, error: 'Login failed - no user returned' };
    } catch (error: any) {
      console.error('Auto-login exception:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [checkDevelopmentMode, setCurrentDevUserType]);

  // Logout functionality
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setCurrentDevUserType(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [setCurrentDevUserType]);

  // Initialize development mode detection
  useEffect(() => {
    console.log('🔧 DevelopmentModeProvider - Initializing');
    
    const isDevMode = checkDevelopmentMode();
    
    console.log('🔧 DevelopmentModeProvider - isDevelopment:', isDevMode);
    setIsDevelopment(isDevMode);
    
    if (isDevMode) {
      // Get current user type from storage
      const currentUserType = getCurrentDevUserType();
      if (currentUserType) {
        console.log('🔧 DevelopmentModeProvider - Current user type:', currentUserType);
        setDevMode(currentUserType);
      }
    } else {
      setDevMode(null);
    }
    
    setIsInitialized(true);
    console.log('🔧 DevelopmentModeProvider - Initialization complete');
  }, [checkDevelopmentMode, getCurrentDevUserType]);

  // Clear dev mode when on landing page or related routes
  useEffect(() => {
    if (!isInitialized || !isDevelopment) return;
    
    const landingRoutes = ['/', '/landing'];
    if (landingRoutes.includes(location.pathname)) {
      if (devMode !== null) {
        console.log('🔧 DevelopmentModeProvider - Clearing dev mode for landing page');
        setDevMode(null);
        logout();
      }
    }
  }, [location.pathname, isInitialized, isDevelopment, devMode]);

  // Handle URL dev mode parameters
  useEffect(() => {
    if (!isInitialized || !isDevelopment) return;
    
    const searchParams = new URLSearchParams(location.search);
    const devModeParam = searchParams.get('dev_mode');
    
    if (devModeParam) {
      const validTypes: DevUserType[] = ['individual', 'establishment', 'promoter', 'admin'];
      if (validTypes.includes(devModeParam as DevUserType)) {
        switchToUserType(devModeParam as DevUserType);
      }
    }
  }, [location.search, isInitialized, isDevelopment]);

  const navigateToUserDashboard = useCallback((userType: DevUserType) => {
    // Clean URL parameters
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('dev_mode');
    window.history.replaceState({}, '', newUrl.toString());

    // Navigate to appropriate dashboard
    let targetPath = '';
    switch (userType) {
      case 'establishment':
        targetPath = '/establishment/dashboard';
        break;
      case 'promoter':
        targetPath = '/promoter';
        break;
      case 'admin':
        targetPath = '/admin/system-breakdown';
        break;
      case 'individual':
        targetPath = '/explore';
        break;
      default:
        targetPath = '/landing';
    }
    
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  const switchToUserType = useCallback(async (userType: DevUserType) => {
    if (!isDevelopment || devMode === userType) return;
    
    console.log('🔧 DevelopmentModeProvider - Switching to user type:', userType);
    setIsLoading(true);
    
    try {
      if (userType) {
        // Use integrated auto-login functionality
        const result = await autoLogin(userType);
        if (result.success) {
          setDevMode(userType);
          navigateToUserDashboard(userType);
          debouncedToast.success(
            'Development Login',
            `Logged in as ${userType}`,
            3000
          );
        } else {
          console.error('Failed to switch user type:', result.error);
          debouncedToast.error(
            'Development Login Failed',
            result.error || 'Unknown error',
            5000
          );
        }
      } else {
        await logout();
        setDevMode(null);
        navigate('/landing', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopment, devMode, autoLogin, navigateToUserDashboard, navigate, logout]);

  const exitDevMode = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
      setDevMode(null);
      navigate('/landing', { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, logout]);

  const value: DevelopmentModeContextType = {
    isDevelopment,
    devMode,
    switchToUserType,
    exitDevMode,
    isDevModeActive: isDevelopment && devMode !== null,
    isInitialized,
    isLoading,
    availableUserTypes
  };

  return (
    <DevelopmentModeContext.Provider value={value}>
      {children}
    </DevelopmentModeContext.Provider>
  );
};

export const useDevelopmentMode = () => {
  const context = useContext(DevelopmentModeContext);
  if (context === undefined) {
    throw new Error('useDevelopmentMode must be used within a DevelopmentModeProvider');
  }
  return context;
};
