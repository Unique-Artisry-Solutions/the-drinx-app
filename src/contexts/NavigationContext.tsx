import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { 
  individualNavItems, 
  establishmentNavItems, 
  promoterNavItems,
  adminNavItems,
  guestNavItems 
} from '@/config/navigation';
import { useDevelopmentMode } from '@/hooks/useDevelopmentMode';

interface NavigationContextType {
  navigationItems: UnifiedNavItem[];
  userType: 'individual' | 'establishment' | 'promoter' | 'admin' | 'guest';
  refreshNavigation: () => void;
  isPathActive: (path: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, authStable, userType: authUserType } = useAuth();
  const { devMode, isDevModeActive } = useDevelopmentMode();
  const location = useLocation();
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | 'guest'>('guest');
  const [navigationItems, setNavigationItems] = useState<UnifiedNavItem[]>(guestNavItems);
  
  const mountedRef = useRef(true);

  // Memoized helper function to check if a path is active
  const isPathActive = useCallback((path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Memoized function to get navigation items based on user type
  const getNavigationItems = useCallback((userType: string): UnifiedNavItem[] => {
    switch (userType) {
      case 'establishment':
        return establishmentNavItems;
      case 'promoter':
        return promoterNavItems;
      case 'admin':
        return adminNavItems;
      case 'individual':
        return individualNavItems;
      default:
        return guestNavItems;
    }
  }, []);

  // Simplified function to determine user type
  const determineUserType = useCallback((): 'individual' | 'establishment' | 'promoter' | 'admin' | 'guest' => {
    // In development mode, use the dev user type if active
    if (isDevModeActive && devMode) {
      return devMode;
    }
    
    if (!authStable) return 'guest';
    
    if (user && session) {
      const userTypeFromAuth = authUserType;
      const userTypeFromStorage = localStorage.getItem('user_type');
      const finalUserType = userTypeFromAuth || userTypeFromStorage || 'individual';
      
      switch (finalUserType) {
        case 'establishment':
          return 'establishment';
        case 'promoter':
          return 'promoter';
        case 'admin':
          return 'admin';
        default:
          return 'individual';
      }
    }
    
    return 'guest';
  }, [user, session, authStable, authUserType, devMode, isDevModeActive]);

  // Update navigation when auth state changes
  const updateNavigation = useCallback(() => {
    if (!mountedRef.current || !authStable) return;
    
    const newUserType = determineUserType();
    const newNavigationItems = getNavigationItems(newUserType);
    
    setUserType(newUserType);
    setNavigationItems(newNavigationItems);
    
    console.log('Navigation updated:', newUserType);
  }, [authStable, determineUserType, getNavigationItems]);

  // Manual refresh function
  const refreshNavigation = useCallback(() => {
    if (mountedRef.current) {
      updateNavigation();
    }
  }, [updateNavigation]);

  // Update navigation when auth becomes stable
  useEffect(() => {
    if (authStable) {
      updateNavigation();
    }
  }, [authStable, updateNavigation]);

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    navigationItems,
    userType,
    refreshNavigation,
    isPathActive
  }), [navigationItems, userType, refreshNavigation, isPathActive]);

  return (
    <NavigationContext.Provider value={contextValue}>
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
