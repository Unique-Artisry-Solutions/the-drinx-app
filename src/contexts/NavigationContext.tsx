
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDevelopmentMode } from './DevelopmentModeContext';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useImpersonationState } from '@/hooks/useImpersonationState';
import { UnifiedNavItem, UserType } from '@/types/navigation/NavigationTypes';
import { getGuestNavItems } from '@/components/navigation/mobile/GuestNavItems';
import { getUserNavItems } from '@/components/navigation/mobile/UserNavItems';
import { getAdminNavItems } from '@/components/navigation/mobile/AdminNavItems';

interface NavigationContextType {
  currentPath: string;
  isProtectedRoute: boolean;
  canAccess: boolean;
  navigationItems: UnifiedNavItem[];
  userType: UserType | null;
  isAuthenticated: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  const { isImpersonating, currentUser } = useImpersonationState();
  
  // Safely get auth state with fallback for hot reload scenarios
  let authState;
  try {
    authState = useAuthenticatedUser();
  } catch (error) {
    console.warn('NavigationProvider: Auth context not available during hot reload, using fallbacks');
    authState = { userType: null, isAuthenticated: false, authStable: false };
  }
  
  const { userType, isAuthenticated, authStable } = authState;
  
  // Use impersonated user's type and authentication if impersonating
  const effectiveUserType = isImpersonating && currentUser ? 
    (currentUser.user_metadata?.user_type as UserType) || 'establishment' : 
    userType;
  const effectiveIsAuthenticated = isImpersonating ? !!currentUser : isAuthenticated;
  
  const [navigationState, setNavigationState] = useState<NavigationContextType>({
    currentPath: location.pathname,
    isProtectedRoute: false,
    canAccess: false,
    navigationItems: getGuestNavItems(),
    userType: null,
    isAuthenticated: false
  });

  useEffect(() => {
    if (!isInitialized || !authStable) return;
    
    const protectedPaths = ['/admin', '/establishment', '/promoter'];
    const isProtected = protectedPaths.some(path => location.pathname.startsWith(path));
    
    let canAccess = true;
    if (isProtected) {
      if (location.pathname.startsWith('/admin')) {
        canAccess = effectiveUserType === 'admin' && effectiveIsAuthenticated;
      } else if (location.pathname.startsWith('/establishment')) {
        canAccess = effectiveUserType === 'establishment' && effectiveIsAuthenticated;
      } else if (location.pathname.startsWith('/promoter')) {
        canAccess = effectiveUserType === 'promoter' && effectiveIsAuthenticated;
      }
    }

    // Get navigation items based on effective user state (considering impersonation)
    let navigationItems: UnifiedNavItem[];
    if (effectiveUserType === 'admin' && effectiveIsAuthenticated) {
      navigationItems = getAdminNavItems();
    } else if (effectiveIsAuthenticated && effectiveUserType) {
      navigationItems = getUserNavItems(effectiveUserType);
    } else {
      navigationItems = getGuestNavItems();
    }
    
    setNavigationState({
      currentPath: location.pathname,
      isProtectedRoute: isProtected,
      canAccess,
      navigationItems,
      userType: effectiveUserType,
      isAuthenticated: effectiveIsAuthenticated
    });
  }, [location.pathname, effectiveUserType, effectiveIsAuthenticated, isInitialized, authStable, isImpersonating]);

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
