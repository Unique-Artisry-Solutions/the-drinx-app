
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

  // Initialize development mode detection quickly
  useEffect(() => {
    const initDevMode = () => {
      try {
        const hostname = window.location.hostname;
        const isDevEnv = hostname === 'localhost' || 
                        hostname === '127.0.0.1' ||
                        hostname.includes('preview--') ||
                        hostname.includes('lovable') ||
                        process.env.NODE_ENV === 'development';
        
        console.log('🛠️ Development mode detected:', isDevEnv);
        setIsDevelopment(isDevEnv);
        
        if (isDevEnv) {
          const savedDevType = localStorage.getItem('dev_user_type') as DevUserType;
          if (savedDevType && ['individual', 'establishment', 'promoter', 'admin'].includes(savedDevType)) {
            console.log('🔄 Restored dev type:', savedDevType);
            setDevMode(savedDevType);
          }
        }
      } catch (error) {
        console.error('❌ Error initializing dev mode:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    // Initialize immediately, don't wait
    initDevMode();
  }, []);

  const switchToUserType = useCallback((userType: DevUserType) => {
    if (!isDevelopment) return;
    
    console.log('🔄 Switching dev mode to:', userType);
    setDevMode(userType);
    
    if (userType) {
      localStorage.setItem('dev_user_type', userType);
    } else {
      localStorage.removeItem('dev_user_type');
    }
  }, [isDevelopment]);

  const exitDevMode = useCallback(() => {
    console.log('🚪 Exiting dev mode');
    setDevMode(null);
    localStorage.removeItem('dev_user_type');
    navigate('/landing', { replace: true });
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
