
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
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
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authStable } = useAuth();
  const location = useLocation();
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | 'guest'>('guest');
  const [navigationItems, setNavigationItems] = useState<UnifiedNavItem[]>(guestNavItems);
  
  // Add refs to prevent unnecessary updates and debounce navigation changes
  const previousUserTypeRef = useRef<string>('guest');
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  // Debounced navigation update function
  const updateNavigation = useMemo(() => {
    return () => {
      if (isUpdatingRef.current) {
        return;
      }
      
      // Clear any pending updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Debounce the update to prevent rapid-fire changes
      updateTimeoutRef.current = setTimeout(() => {
        isUpdatingRef.current = true;
        
        let newUserType: 'individual' | 'establishment' | 'promoter' | 'admin' | 'guest' = 'guest';
        let newNavigationItems = guestNavItems;

        // Only update if auth is stable
        if (authStable) {
          const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
          const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
          
          if (isAdminAuth || isAdminBypass) {
            newUserType = 'admin';
            newNavigationItems = adminNavItems;
          } else if (user) {
            const userTypeFromStorage = localStorage.getItem('user_type') || 'individual';
            
            switch (userTypeFromStorage) {
              case 'establishment':
                newUserType = 'establishment';
                newNavigationItems = establishmentNavItems;
                break;
              case 'promoter':
                newUserType = 'promoter';
                newNavigationItems = promoterNavItems;
                break;
              case 'admin':
                newUserType = 'admin';
                newNavigationItems = adminNavItems;
                break;
              default:
                newUserType = 'individual';
                newNavigationItems = individualNavItems;
                break;
            }
          }
        }

        // Only update state if the user type actually changed
        if (previousUserTypeRef.current !== newUserType) {
          console.log('Navigation: User type changed from', previousUserTypeRef.current, 'to', newUserType);
          previousUserTypeRef.current = newUserType;
          setUserType(newUserType);
          setNavigationItems(newNavigationItems);
        }
        
        isUpdatingRef.current = false;
      }, 100); // 100ms debounce
    };
  }, [user, authStable]);

  // Update navigation when auth state or location changes, but only if auth is stable
  useEffect(() => {
    if (authStable) {
      updateNavigation();
    }
  }, [user, authStable, location.pathname, updateNavigation]);

  // Manual refresh function
  const refreshNavigation = () => {
    updateNavigation();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    navigationItems,
    userType,
    refreshNavigation
  }), [navigationItems, userType, refreshNavigation]);

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
