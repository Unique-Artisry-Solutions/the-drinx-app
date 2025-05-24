
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
  shouldShowFeature,
  resolveEffectiveUserType,
  EffectiveUserState
} from '@/components/navigation/utils/navigationItems';

interface NavigationContextType {
  navigationItems: NavigationItem[];
  breadcrumbs: BreadcrumbItem[];
  activeTab: string | null;
  userType: UserType | null;
  shouldShowFeature: (featureKey: string) => boolean;
  isPathActive: (path: string) => boolean;
  isAuthenticated: boolean;
  effectiveState: EffectiveUserState;
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
  const [effectiveState, setEffectiveState] = useState<EffectiveUserState>({
    userType: null,
    isAuthenticated: false,
    isDevelopment: false,
    isDevModeActive: false
  });
  
  // Function to check if a path is active
  const isPathActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Rebuild navigation items and breadcrumbs on route changes or state changes
  useEffect(() => {
    console.log('NavigationProvider - Recalculating navigation items', {
      pathname: location.pathname,
      authIsAuthenticated,
      authUserType,
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
    
    // Resolve the effective user state
    const newEffectiveState = resolveEffectiveUserType(
      authUserType,
      authIsAuthenticated,
      devMode,
      isDevelopment,
      isDevModeActive && isStateStable
    );
    
    setEffectiveState(newEffectiveState);
    
    const newNavigationItems = generateNavigationItems(
      newEffectiveState,
      navigationConfig
    );
    setNavigationItems(newNavigationItems);
    
    const newBreadcrumbs = generateBreadcrumbs(location.pathname, newNavigationItems);
    setBreadcrumbs(newBreadcrumbs);
    
    const newActiveTab = getActiveTab(location.pathname, newNavigationItems);
    setActiveTab(newActiveTab);
  }, [
    location.pathname, 
    authIsAuthenticated, 
    authUserType, 
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
    userType: effectiveState.userType,
    shouldShowFeature: (featureKey: string) => shouldShowFeature(featureKey, effectiveState),
    isPathActive,
    isAuthenticated: effectiveState.isAuthenticated,
    effectiveState
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
