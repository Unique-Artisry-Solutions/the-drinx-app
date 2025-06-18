
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type DevUserType = 'individual' | 'establishment' | 'promoter' | 'admin' | null;

interface DevelopmentModeContextType {
  isDevelopment: boolean;
  devMode: DevUserType;
  switchToUserType: (userType: DevUserType) => void;
  exitDevMode: () => void;
  disableDevMode: () => void;
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
    const hostname = window.location.hostname;
    const isDevMode = hostname === 'localhost' || 
                     hostname === '127.0.0.1' ||
                     hostname.includes('preview--') ||
                     hostname.includes('lovable');
    
    setIsDevelopment(isDevMode);
    
    if (isDevMode) {
      const savedDevType = localStorage.getItem('dev_user_type') as DevUserType;
      if (savedDevType) {
        setDevMode(savedDevType);
      }
    } else {
      localStorage.removeItem('dev_user_type');
      setDevMode(null);
    }
    
    setIsInitialized(true);
  }, []);

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
        targetPath = '/promoter'; // Changed from '/promoter/dashboard' to '/promoter'
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

  const switchToUserType = useCallback((userType: DevUserType) => {
    if (!isDevelopment || devMode === userType) return;
    
    setDevMode(userType);
    
    if (userType) {
      localStorage.setItem('dev_user_type', userType);
      navigateToUserDashboard(userType);
    } else {
      localStorage.removeItem('dev_user_type');
      navigate('/landing', { replace: true });
    }
  }, [isDevelopment, devMode, navigateToUserDashboard, navigate]);

  const exitDevMode = useCallback(() => {
    setDevMode(null);
    localStorage.removeItem('dev_user_type');
    navigate('/landing', { replace: true });
  }, [navigate]);

  const disableDevMode = useCallback(() => {
    setDevMode(null);
    localStorage.removeItem('dev_user_type');
  }, []);

  const value: DevelopmentModeContextType = {
    isDevelopment,
    devMode,
    switchToUserType,
    exitDevMode,
    disableDevMode,
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
