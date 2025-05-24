
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type DevUserType = 'individual' | 'establishment' | 'promoter' | 'admin' | null;

interface DevelopmentModeContextType {
  isDevelopment: boolean;
  devMode: DevUserType;
  switchToUserType: (userType: DevUserType) => void;
  exitDevMode: () => void;
  isDevModeActive: boolean;
  isInitialized: boolean;
  isStateStable: boolean;
}

const DevelopmentModeContext = createContext<DevelopmentModeContextType | undefined>(undefined);

export const DevelopmentModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Core state
  const [devMode, setDevMode] = useState<DevUserType>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs for immediate access and preventing race conditions
  const isDevelopmentRef = useRef<boolean>(false);
  const devModeRef = useRef<DevUserType>(null);
  const isInitializedRef = useRef<boolean>(false);
  const stateStableRef = useRef<boolean>(false);

  // Initialize development mode detection ONCE at app startup
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    console.log('DevelopmentModeProvider - Starting initialization');
    
    const detectDevelopmentMode = () => {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || 
                         hostname === '127.0.0.1' ||
                         hostname.includes('preview--') ||
                         hostname.includes('lovable');
      
      return isLocalhost;
    };

    const isDevMode = detectDevelopmentMode();
    
    // Update both state and refs synchronously
    isDevelopmentRef.current = isDevMode;
    setIsDevelopment(isDevMode);
    
    // Load saved dev mode from localStorage if in development
    if (isDevMode) {
      const savedDevType = localStorage.getItem('dev_user_type') as DevUserType;
      if (savedDevType) {
        console.log('DevelopmentModeProvider - Restored dev mode from storage:', savedDevType);
        devModeRef.current = savedDevType;
        setDevMode(savedDevType);
      }
    } else {
      // Clear dev mode if not in development
      localStorage.removeItem('dev_user_type');
      devModeRef.current = null;
      setDevMode(null);
    }
    
    // Mark as initialized and stable
    isInitializedRef.current = true;
    setIsInitialized(true);
    
    // Allow a brief moment for state to settle before marking as stable
    setTimeout(() => {
      stateStableRef.current = true;
      console.log('DevelopmentModeProvider - Initialization complete and stable');
    }, 100);
    
  }, []); // Empty dependency array - run only once

  // Handle URL parameters on route changes (only after initialization)
  useEffect(() => {
    if (!isInitializedRef.current || !isDevelopmentRef.current) return;
    
    const searchParams = new URLSearchParams(location.search);
    const devModeParam = searchParams.get('dev_mode');
    
    if (devModeParam) {
      const validTypes: DevUserType[] = ['individual', 'establishment', 'promoter', 'admin'];
      if (validTypes.includes(devModeParam as DevUserType)) {
        const userType = devModeParam as DevUserType;
        console.log('DevelopmentModeProvider - Setting dev mode from URL parameter:', userType);
        
        // Only switch if different from current mode
        if (devModeRef.current !== userType) {
          switchToUserType(userType);
        }
      }
    }
  }, [location.search]);

  const navigateToUserTypeDashboard = useCallback((userType: DevUserType) => {
    // Clean up URL parameters first
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('dev_mode');
    window.history.replaceState({}, '', newUrl.toString());

    console.log('DevelopmentModeProvider - Navigating to dashboard for:', userType);

    // Navigate to appropriate dashboard
    const currentPath = location.pathname;
    let targetPath = '';
    
    switch (userType) {
      case 'establishment':
        targetPath = '/establishment/dashboard';
        break;
      case 'promoter':
        targetPath = '/promoter/dashboard';
        break;
      case 'admin':
        targetPath = '/admin/dashboard'; // Simplified to go directly to dashboard
        break;
      case 'individual':
        targetPath = '/explore';
        break;
      default:
        targetPath = '/landing';
    }
    
    // Only navigate if we're not already at the target
    if (currentPath !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  const switchToUserType = useCallback((userType: DevUserType) => {
    if (!isDevelopmentRef.current) {
      console.log('DevelopmentModeProvider - Not in development mode, ignoring user type switch');
      return;
    }
    
    // Prevent switching to the same user type
    if (devModeRef.current === userType) {
      console.log('DevelopmentModeProvider - Already in mode:', userType, 'skipping switch');
      return;
    }
    
    console.log('DevelopmentModeProvider - Switching to user type:', userType);
    
    // SYNCHRONOUS state updates for immediate availability
    devModeRef.current = userType;
    setDevMode(userType);
    
    if (userType) {
      localStorage.setItem('dev_user_type', userType);
      navigateToUserTypeDashboard(userType);
    } else {
      localStorage.removeItem('dev_user_type');
      if (location.pathname !== '/landing') {
        navigate('/landing', { replace: true });
      }
    }
  }, [navigateToUserTypeDashboard, navigate, location.pathname]);

  const exitDevMode = useCallback(() => {
    console.log('DevelopmentModeProvider - Exiting dev mode');
    devModeRef.current = null;
    setDevMode(null);
    localStorage.removeItem('dev_user_type');
    if (location.pathname !== '/landing') {
      navigate('/landing', { replace: true });
    }
  }, [navigate, location.pathname]);

  const value: DevelopmentModeContextType = {
    isDevelopment: isDevelopmentRef.current,
    devMode: devModeRef.current,
    switchToUserType,
    exitDevMode,
    isDevModeActive: isDevelopmentRef.current && devModeRef.current !== null,
    isInitialized: isInitializedRef.current,
    isStateStable: stateStableRef.current
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
