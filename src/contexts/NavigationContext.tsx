
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  UserType, 
  NavigationItem, 
  NavigationConfig,
  BreadcrumbItem
} from '@/types/navigation';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { 
  generateNavigationItems, 
  generateBreadcrumbs, 
  getActiveTab,
  shouldShowFeature
} from '@/components/navigation/utils/navigationItems';

interface NavigationContextType {
  navigationItems: NavigationItem[];
  breadcrumbs: BreadcrumbItem[];
  activeTab: string | null;
  userType: UserType | null;
  shouldShowFeature: (featureKey: string) => boolean;
  isPathActive: (path: string) => boolean;
  isAuthenticated: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  navigationConfig?: NavigationConfig;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children, navigationConfig }) => {
  const location = useLocation();
  const { user, userType: authUserType, isAuthenticated: authIsAuthenticated, isLoading, authStable } = useAuth();
  const isMobile = useIsMobile();
  const { isDevelopment, isDevModeActive, devMode, isInitialized, isStateStable } = useDevelopmentMode();
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // Determine effective user type and authentication state
  const effectiveUserType: UserType | null = isDevelopment && isDevModeActive && isStateStable 
    ? devMode 
    : authUserType;
  
  const effectiveIsAuthenticated = isDevelopment && isDevModeActive && isStateStable 
    ? Boolean(devMode) 
    : authIsAuthenticated;
  
  // Function to check if a path is active
  const isPathActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Rebuild navigation items and breadcrumbs on route changes or state changes
  useEffect(() => {
    console.log('NavigationProvider - Recalculating navigation items', {
      pathname: location.pathname,
      effectiveIsAuthenticated,
      effectiveUserType,
      isLoading,
      authStable,
      isDevelopment,
      isDevModeActive,
      devMode,
      isInitialized,
      isStateStable
    });
    
    // Wait for auth to stabilize AND for dev mode to initialize
    if (isLoading || !authStable || !isInitialized) {
      console.log('NavigationProvider - Waiting for systems to stabilize');
      return;
    }
    
    const newNavigationItems = generateNavigationItems(
      effectiveUserType,
      effectiveIsAuthenticated,
      navigationConfig
    );
    setNavigationItems(newNavigationItems);
    
    const newBreadcrumbs = generateBreadcrumbs(location.pathname, newNavigationItems);
    setBreadcrumbs(newBreadcrumbs);
    
    const newActiveTab = getActiveTab(location.pathname, newNavigationItems);
    setActiveTab(newActiveTab);
  }, [
    location.pathname, 
    effectiveIsAuthenticated, 
    effectiveUserType, 
    isLoading, 
    authStable, 
    isDevelopment, 
    isDevModeActive, 
    devMode,
    isInitialized,
    isStateStable,
    isMobile, 
    navigationConfig
  ]);
  
  const contextValue: NavigationContextType = {
    navigationItems,
    breadcrumbs,
    activeTab,
    userType: effectiveUserType,
    shouldShowFeature: (featureKey: string) => shouldShowFeature(featureKey, effectiveUserType),
    isPathActive,
    isAuthenticated: effectiveIsAuthenticated
  };
  
  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
