
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

interface NavigationContextType {
  navigationItems: UnifiedNavItem[];
  userType: 'individual' | 'establishment' | 'promoter' | 'admin' | 'guest';
  refreshNavigation: () => void;
  isPathActive: (path: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, authStable, userType: authUserType } = useAuth();
  const location = useLocation();
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | 'guest'>('guest');
  const [navigationItems, setNavigationItems] = useState<UnifiedNavItem[]>(guestNavItems);
  
  // Refs to prevent unnecessary updates and manage cleanup
  const previousUserTypeRef = useRef<string>('guest');
  const previousUserIdRef = useRef<string | null>(null);
  const previousAuthStableRef = useRef<boolean>(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);
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

  // Simplified function to determine user type from auth context only
  const determineUserType = useCallback((): 'individual' | 'establishment' | 'promoter' | 'admin' | 'guest' => {
    if (!authStable) return 'guest';
    
    // Check for authenticated user
    if (user && session) {
      // Use userType from auth context first, then localStorage as fallback
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
  }, [user, session, authStable, authUserType]);

  // Debounced navigation update function with proper cleanup
  const updateNavigation = useCallback(() => {
    // Prevent updates if component is unmounted
    if (!mountedRef.current) return;
    
    // Prevent overlapping updates
    if (isUpdatingRef.current) return;
    
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
    
    // Debounce the update to prevent rapid-fire changes
    updateTimeoutRef.current = setTimeout(() => {
      // Double-check if component is still mounted
      if (!mountedRef.current) return;
      
      isUpdatingRef.current = true;
      
      try {
        const newUserType = determineUserType();
        const currentUserId = user?.id || null;
        
        // Only update if something actually changed
        const userTypeChanged = previousUserTypeRef.current !== newUserType;
        const userIdChanged = previousUserIdRef.current !== currentUserId;
        const authStableChanged = previousAuthStableRef.current !== authStable;
        
        if (userTypeChanged || userIdChanged || authStableChanged) {
          console.log('Navigation: Updating due to changes', {
            userTypeChanged,
            userIdChanged,
            authStableChanged,
            from: previousUserTypeRef.current,
            to: newUserType
          });
          
          const newNavigationItems = getNavigationItems(newUserType);
          
          // Update refs before setting state
          previousUserTypeRef.current = newUserType;
          previousUserIdRef.current = currentUserId;
          previousAuthStableRef.current = authStable;
          
          // Update state only if component is still mounted
          if (mountedRef.current) {
            setUserType(newUserType);
            setNavigationItems(newNavigationItems);
          }
        }
      } catch (error) {
        console.error('Navigation update error:', error);
      } finally {
        isUpdatingRef.current = false;
        updateTimeoutRef.current = null;
      }
    }, 150); // Increased debounce to 150ms for better stability
  }, [user, session, authStable, authUserType, determineUserType, getNavigationItems]);

  // Manual refresh function
  const refreshNavigation = useCallback(() => {
    if (mountedRef.current) {
      updateNavigation();
    }
  }, [updateNavigation]);

  // Update navigation when dependencies change, but only if auth is stable
  useEffect(() => {
    if (authStable) {
      updateNavigation();
    }
  }, [user, session, authStable, authUserType, updateNavigation]);

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
      isUpdatingRef.current = false;
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
