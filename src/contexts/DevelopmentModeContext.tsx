
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

  // Auto-login functionality with comprehensive debugging and state persistence
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
      // **PHASE 3 FIX**: Set DevTools state persistence BEFORE authentication
      setCurrentDevUserType(userType);
      localStorage.setItem('dev_auto_login_timestamp', Date.now().toString());
      console.log('🔧 DevBypass - DevTools state set, timestamp:', Date.now());

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
        // Clear DevTools state on error
        localStorage.removeItem('dev_auto_login_user_type');
        localStorage.removeItem('dev_auto_login_timestamp');
        return { success: false, error: msg };
      }

      if (data.user) {
        console.log(`🔧 DevBypass - Login successful for ${userType}:`, {
          email: credentials.email,
          userId: data.user.id,
          userType: data.user.user_metadata?.user_type,
          timestamp: Date.now()
        });
        
        // **PHASE 3 FIX**: Refresh timestamp after successful login
        localStorage.setItem('dev_auto_login_timestamp', Date.now().toString());
        
        return { success: true };
      }

      const msg = 'Login failed - no user returned from Supabase';
      console.error('🔧 DevBypass - Error:', msg);
      // Clear DevTools state on error
      localStorage.removeItem('dev_auto_login_user_type');
      localStorage.removeItem('dev_auto_login_timestamp');
      return { success: false, error: msg };
    } catch (error: any) {
      const msg = error.message || 'Unknown exception during auto-login';
      console.error('🔧 DevBypass - Exception:', error);
      // Clear DevTools state on error
      localStorage.removeItem('dev_auto_login_user_type');
      localStorage.removeItem('dev_auto_login_timestamp');
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
    
    // **PHASE 3 FIX**: Enhanced navigation with retry logic and fallback recovery for all user types
    const attemptNavigation = async (attempt: number = 1): Promise<boolean> => {
      console.log(`🔧 DevBypass - Navigation attempt ${attempt} to ${targetPath}`);
      
      try {
        navigate(targetPath, { replace: true });
        
        // Wait and check if navigation was successful
        await new Promise(resolve => setTimeout(resolve, 200));
        const currentPath = window.location.pathname;
        
        if (currentPath === targetPath) {
          console.log(`🔧 DevBypass - Navigation successful on attempt ${attempt}`);
          return true;
        } else {
          console.log(`🔧 DevBypass - Navigation attempt ${attempt} failed, current path: ${currentPath}`);
          return false;
        }
      } catch (error) {
        console.error(`🔧 DevBypass - Navigation attempt ${attempt} threw error:`, error);
        return false;
      }
    };

    // **PHASE 4 FIX**: Multi-attempt navigation with automatic recovery
    const maxAttempts = userType === 'admin' ? 5 : 3;
    let successful = false;
    
    for (let attempt = 1; attempt <= maxAttempts && !successful; attempt++) {
      successful = await attemptNavigation(attempt);
      
      if (!successful && attempt < maxAttempts) {
        // Wait longer between attempts for admin
        const delay = userType === 'admin' ? (attempt * 300) : (attempt * 200);
        console.log(`🔧 DevBypass - Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // **PHASE 4 FIX**: Final fallback using window.location if all attempts failed
    if (!successful) {
      console.warn(`🔧 DevBypass - All ${maxAttempts} navigation attempts failed, using window.location fallback`);
      try {
        window.location.href = targetPath;
      } catch (error) {
        console.error('🔧 DevBypass - Even window.location fallback failed:', error);
        
        // **PHASE 4 FIX**: User feedback when all navigation fails
        const message = `❌ DevTools Navigation Failed: Unable to navigate to ${targetPath}. Please manually navigate or refresh the page.`;
        console.error(message);
        alert(message);
      }
    }
  }, [navigate, location.pathname]);

  const switchToUserType = useCallback(async (userType: DevUserType) => {
    console.log(`🔧 DevBypass - switchToUserType called:`, { 
      userType, 
      isDevelopment, 
      currentDevMode: devMode,
      isAlreadyThisUser: devMode === userType,
      timestamp: Date.now()
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
        // **PHASE 3 FIX**: Enhanced login tracking and debugging
        console.log(`🔧 DevBypass - Initiating login process for ${userType} with enhanced tracking`);
        const startTime = Date.now();
        
        const result = await autoLogin(userType);
        
        if (result.success) {
          const loginDuration = Date.now() - startTime;
          console.log(`🔧 DevBypass - Login successful in ${loginDuration}ms, updating state and navigation`);
          
          setDevMode(userType);
          
          // **PHASE 3 FIX**: Add retry logic for navigation
          console.log(`🔧 DevBypass - Beginning navigation process for ${userType}`);
          const navigationStartTime = Date.now();
          
          try {
            await navigateToUserDashboard(userType);
            const navigationDuration = Date.now() - navigationStartTime;
            console.log(`🔧 DevBypass - Navigation completed in ${navigationDuration}ms`);
            
            // Success feedback
            const successMsg = `✅ Development Login Successful: Logged in as ${userType} (${loginDuration + navigationDuration}ms total)`;
            console.log(successMsg);
            
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
          } catch (navigationError: any) {
            // **PHASE 4 FIX**: Navigation error recovery
            console.error('🔧 DevBypass - Navigation failed:', navigationError);
            const navErrorMsg = `⚠️ Login successful but navigation failed: ${navigationError.message}. Try refreshing or manually navigating.`;
            console.error(navErrorMsg);
            alert(navErrorMsg);
          }
        } else {
          console.error('🔧 DevBypass - Login failed:', result.error);
          
          // **PHASE 4 FIX**: Enhanced error feedback
          const errorMsg = `❌ Development Login Failed: ${result.error}`;
          console.error(errorMsg);
          
          try {
            debouncedToast.error(
              'Development Login Failed',
              result.error || 'Unknown error',
              5000
            );
          } catch (toastError) {
            console.warn('🔧 DevBypass - Error toast failed, using alert:', toastError);
            alert(errorMsg);
          }
        }
      } else {
        console.log('🔧 DevBypass - Logging out and returning to landing');
        await logout();
        setDevMode(null);
        navigate('/landing', { replace: true });
      }
    } catch (error: any) {
      // **PHASE 4 FIX**: Enhanced exception handling with recovery suggestions
      const errorMsg = `🔧 DevBypass - Exception in switchToUserType: ${error.message}`;
      console.error(errorMsg, error);
      
      const recoveryMsg = `❌ ${errorMsg}\n\nRecovery suggestions:\n1. Refresh the page\n2. Clear browser cache\n3. Check browser console for details`;
      alert(recoveryMsg);
      
      // Clear potentially corrupted DevTools state
      localStorage.removeItem('dev_auto_login_user_type');
      localStorage.removeItem('dev_auto_login_timestamp');
      setDevMode(null);
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
