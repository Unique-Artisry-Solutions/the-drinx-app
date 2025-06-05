
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type DevUserType = 'individual' | 'establishment' | 'promoter' | 'admin' | null;

interface DevelopmentModeContextType {
  isDevelopment: boolean;
  devMode: DevUserType;
  switchToUserType: (userType: DevUserType) => void;
  exitDevMode: () => void;
  isDevModeActive: boolean;
  isInitialized: boolean;
}

const DevelopmentModeContext = createContext<DevelopmentModeContextType | undefined>(undefined);

export const DevelopmentModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [devMode, setDevMode] = useState<DevUserType>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize development mode detection
  useEffect(() => {
    try {
      const hostname = window.location.hostname;
      const isDevMode = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname.includes('preview--') ||
                       hostname.includes('lovable') ||
                       process.env.NODE_ENV === 'development';
      
      console.log('Development mode detected:', isDevMode, 'hostname:', hostname);
      setIsDevelopment(isDevMode);
      
      if (isDevMode) {
        const savedDevType = localStorage.getItem('dev_user_type') as DevUserType;
        console.log('Restored dev type from localStorage:', savedDevType);
        if (savedDevType && ['individual', 'establishment', 'promoter', 'admin'].includes(savedDevType)) {
          setDevMode(savedDevType);
        }
      } else {
        localStorage.removeItem('dev_user_type');
        setDevMode(null);
      }
    } catch (error) {
      console.error('Error initializing development mode:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Handle URL dev mode parameters
  useEffect(() => {
    if (!isInitialized || !isDevelopment) return;
    
    try {
      const searchParams = new URLSearchParams(location.search);
      const devModeParam = searchParams.get('dev_mode');
      
      if (devModeParam) {
        const validTypes: DevUserType[] = ['individual', 'establishment', 'promoter', 'admin'];
        if (validTypes.includes(devModeParam as DevUserType)) {
          console.log('Switching to dev mode from URL param:', devModeParam);
          switchToUserType(devModeParam as DevUserType);
        }
      }
    } catch (error) {
      console.error('Error handling URL dev mode params:', error);
    }
  }, [location.search, isInitialized, isDevelopment]);

  const navigateToUserDashboard = useCallback((userType: DevUserType) => {
    try {
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
          targetPath = '/promoter/dashboard';
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
      
      console.log('Navigating to dashboard:', targetPath);
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    } catch (error) {
      console.error('Error navigating to user dashboard:', error);
    }
  }, [navigate, location.pathname]);

  const switchToUserType = useCallback((userType: DevUserType) => {
    try {
      if (!isDevelopment || devMode === userType) return;
      
      console.log('Switching dev mode from', devMode, 'to', userType);
      setDevMode(userType);
      
      if (userType) {
        localStorage.setItem('dev_user_type', userType);
        navigateToUserDashboard(userType);
      } else {
        localStorage.removeItem('dev_user_type');
        navigate('/landing', { replace: true });
      }
    } catch (error) {
      console.error('Error switching user type:', error);
    }
  }, [isDevelopment, devMode, navigateToUserDashboard, navigate]);

  const exitDevMode = useCallback(() => {
    try {
      console.log('Exiting dev mode');
      setDevMode(null);
      localStorage.removeItem('dev_user_type');
      navigate('/landing', { replace: true });
    } catch (error) {
      console.error('Error exiting dev mode:', error);
    }
  }, [navigate]);

  const value: DevelopmentModeContextType = {
    isDevelopment,
    devMode,
    switchToUserType,
    exitDevMode,
    isDevModeActive: isDevelopment && devMode !== null,
    isInitialized
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
