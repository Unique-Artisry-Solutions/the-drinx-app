
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

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

  // Handle URL dev mode parameters WITHOUT automatic navigation
  useEffect(() => {
    if (!isInitialized || !isDevelopment) return;
    
    const searchParams = new URLSearchParams(location.search);
    const devModeParam = searchParams.get('dev_mode');
    
    if (devModeParam) {
      const validTypes: DevUserType[] = ['individual', 'establishment', 'promoter', 'admin'];
      if (validTypes.includes(devModeParam as DevUserType)) {
        setDevMode(devModeParam as DevUserType);
        localStorage.setItem('dev_user_type', devModeParam);
        
        // Clean URL parameters without navigation
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('dev_mode');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [location.search, isInitialized, isDevelopment]);

  const switchToUserType = useCallback((userType: DevUserType) => {
    if (!isDevelopment || devMode === userType) return;
    
    setDevMode(userType);
    
    if (userType) {
      localStorage.setItem('dev_user_type', userType);
    } else {
      localStorage.removeItem('dev_user_type');
    }
    
    // NOTE: Removed automatic navigation - components handle their own navigation
  }, [isDevelopment, devMode]);

  const exitDevMode = useCallback(() => {
    setDevMode(null);
    localStorage.removeItem('dev_user_type');
    // NOTE: Removed automatic navigation - components handle their own navigation
  }, []);

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
