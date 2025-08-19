
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
           window.location.hostname.includes('lovableproject.com') ||
           window.location.hostname.includes('lovable.app');
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

  // Auto-login functionality with comprehensive debugging
  const autoLogin = useCallback(async (userType: TestUserType): Promise<{ success: boolean; error?: string }> => {
    console.log(`🔧 DevBypass - Starting auto-login for ${userType}`);
    
    if (!checkDevelopmentMode()) {
      const msg = 'Not in development mode';
      console.error('🔧 DevBypass - Error:', msg);
      return { success: false, error: msg };
    }

    const credentials = TEST_CREDENTIALS[userType];
    if (!credentials) {
      const msg = `No credentials found for user type: ${userType}`;
      console.error('🔧 DevBypass - Error:', msg);
      return { success: false, error: msg };
    }

    console.log(`🔧 DevBypass - Using credentials for ${userType}:`, { email: credentials.email });

    try {
      // First, check if we need to sign out current user
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession?.session?.user) {
        console.log('🔧 DevBypass - Current user detected, signing out first:', currentSession.session.user.email);
        await supabase.auth.signOut();
        // Wait a bit for cleanup
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('🔧 DevBypass - Attempting sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        const msg = `Auth error: ${error.message}`;
        console.error('🔧 DevBypass - Sign in error:', error);
        return { success: false, error: msg };
      }

      if (data.user) {
        setCurrentDevUserType(userType);
        console.log(`🔧 DevBypass - Login successful for ${userType}:`, {
          email: credentials.email,
          userId: data.user.id,
          userType: data.user.user_metadata?.user_type
        });
        return { success: true };
      }

      const msg = 'Login failed - no user returned from Supabase';
      console.error('🔧 DevBypass - Error:', msg);
      return { success: false, error: msg };
    } catch (error: any) {
      const msg = error.message || 'Unknown exception during auto-login';
      console.error('🔧 DevBypass - Exception:', error);
      return { success: false, error: msg };
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

  const navigateToUserDashboard = useCallback(async (userType: DevUserType) => {
    console.log(`🔧 DevBypass - navigateToUserDashboard called for ${userType}`);
    
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
    
    console.log(`🔧 DevBypass - Target path: ${targetPath}, Current path: ${location.pathname}`);
    
    // **CRITICAL FIX**: Enhanced admin navigation with multiple fallback attempts
    if (userType === 'admin') {
      console.log('🔧 DevBypass - Admin navigation starting, implementing robust navigation strategy');
      
      // Strategy 1: Immediate navigation attempt
      console.log(`🔧 DevBypass - Strategy 1: Direct navigation to ${targetPath}`);
      navigate(targetPath, { replace: true });
      
      // Strategy 2: Wait for auth state and try again if still on login page  
      setTimeout(() => {
        const currentPath = window.location.pathname;
        console.log(`🔧 DevBypass - Strategy 2: Post-delay check, current path: ${currentPath}`);
        
        if (currentPath === '/admin/login') {
          console.log('🔧 DevBypass - Still on admin login, attempting navigation again');
          navigate(targetPath, { replace: true });
        }
      }, 300);
      
      // Strategy 3: Final fallback after longer delay
      setTimeout(() => {
        const currentPath = window.location.pathname;
        console.log(`🔧 DevBypass - Strategy 3: Final fallback check, current path: ${currentPath}`);
        
        if (currentPath === '/admin/login') {
          console.warn('🔧 DevBypass - Still stuck on admin login after multiple attempts, using window.location');
          window.location.href = targetPath;
        } else {
          console.log('🔧 DevBypass - Admin navigation successful');
        }
      }, 1000);
    } else {
      // For non-admin routes, navigate immediately
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  const switchToUserType = useCallback(async (userType: DevUserType) => {
    console.log(`🔧 DevBypass - switchToUserType called:`, { 
      userType, 
      isDevelopment, 
      currentDevMode: devMode,
      isAlreadyThisUser: devMode === userType
    });

    if (!isDevelopment) {
      console.warn('🔧 DevBypass - Not in development mode, ignoring switch request');
      return;
    }

    if (devMode === userType) {
      console.log(`🔧 DevBypass - Already logged in as ${userType}, ignoring`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (userType) {
        // Use integrated auto-login functionality
        console.log(`🔧 DevBypass - Initiating login process for ${userType}`);
        const result = await autoLogin(userType);
        
        if (result.success) {
          console.log(`🔧 DevBypass - Login successful, updating state and navigation`);
          setDevMode(userType);
          await navigateToUserDashboard(userType);
          
          // Use simple browser alert for development instead of toast
          console.log(`✅ Development Login Successful: Logged in as ${userType}`);
          
          // Try toast but don't fail if it errors
          try {
            debouncedToast.success(
              'Development Login',
              `Logged in as ${userType}`,
              3000
            );
          } catch (toastError) {
            console.warn('🔧 DevBypass - Toast failed, using fallback:', toastError);
            alert(`✅ Development Login: Logged in as ${userType}`);
          }
        } else {
          console.error('🔧 DevBypass - Login failed:', result.error);
          
          // Use simple browser alert for development errors
          const errorMsg = `❌ Development Login Failed: ${result.error}`;
          console.error(errorMsg);
          alert(errorMsg);
          
          // Try toast but don't fail if it errors
          try {
            debouncedToast.error(
              'Development Login Failed',
              result.error || 'Unknown error',
              5000
            );
          } catch (toastError) {
            console.warn('🔧 DevBypass - Error toast failed:', toastError);
          }
        }
      } else {
        console.log('🔧 DevBypass - Logging out and returning to landing');
        await logout();
        setDevMode(null);
        navigate('/landing', { replace: true });
      }
    } catch (error: any) {
      const errorMsg = `🔧 DevBypass - Exception in switchToUserType: ${error.message}`;
      console.error(errorMsg, error);
      alert(`❌ ${errorMsg}`);
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
