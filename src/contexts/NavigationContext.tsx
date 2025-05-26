
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDevelopmentMode } from './DevelopmentModeContext';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';

interface NavigationContextType {
  currentPath: string;
  isProtectedRoute: boolean;
  canAccess: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  const { userType, isAuthenticated } = useDevAuthBypass();
  
  const [navigationState, setNavigationState] = useState<NavigationContextType>({
    currentPath: location.pathname,
    isProtectedRoute: false,
    canAccess: false
  });

  useEffect(() => {
    if (!isInitialized) return;
    
    const protectedPaths = ['/admin', '/establishment', '/promoter'];
    const isProtected = protectedPaths.some(path => location.pathname.startsWith(path));
    
    let canAccess = true;
    if (isProtected) {
      if (location.pathname.startsWith('/admin')) {
        canAccess = userType === 'admin' && isAuthenticated;
      } else if (location.pathname.startsWith('/establishment')) {
        canAccess = userType === 'establishment' && isAuthenticated;
      } else if (location.pathname.startsWith('/promoter')) {
        canAccess = userType === 'promoter' && isAuthenticated;
      }
    }
    
    setNavigationState({
      currentPath: location.pathname,
      isProtectedRoute: isProtected,
      canAccess
    });
  }, [location.pathname, userType, isAuthenticated, isInitialized]);

  return (
    <NavigationContext.Provider value={navigationState}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
