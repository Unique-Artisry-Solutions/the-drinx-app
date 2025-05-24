
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { NavigationType, UnifiedNavItem } from '@/types/navigation/NavigationTypes';

// Create the navigation structure by user type
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';

interface NavigationContextType {
  navigationType: NavigationType;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin';
  navigationItems: UnifiedNavItem[];
  isPathActive: (path: string) => boolean;
  getProfilePath: () => string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [navigationType, setNavigationType] = useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [navigationItems, setNavigationItems] = useState<UnifiedNavItem[]>([]);

  // Effect to determine user type and navigation type
  useEffect(() => {
    const determineUserType = () => {
      const userTypeFromStorage = localStorage.getItem('user_type');
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      
      if (isAdminAuth) {
        setUserType('admin');
        setNavigationType(NavigationType.ADMIN);
        return;
      }
      
      if (userTypeFromStorage === 'establishment') {
        setUserType('establishment');
      } else if (userTypeFromStorage === 'promoter') {
        setUserType('promoter');
      } else {
        setUserType('individual');
      }
      
      // Define public paths that always use guest navigation
      const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
      const isPublicPath = publicPaths.includes(location.pathname);
      
      if (!user || isPublicPath) {
        setNavigationType(NavigationType.GUEST);
      } else {
        setNavigationType(NavigationType.USER);
      }
    };
    
    determineUserType();
  }, [user, location.pathname]);

  // Effect to set navigation items based on navigation type and user type
  useEffect(() => {
    const determineNavigationItems = () => {
      // Example: Return admin navigation items if in admin mode
      if (navigationType === NavigationType.ADMIN || userType === 'admin') {
        // Convert admin nav items to unified format
        const unifiedAdminItems: UnifiedNavItem[] = adminNavItems
          .filter(item => item.showInNav)
          .map(item => ({
            label: item.label,
            path: item.path,
            icon: item.icon,
            showInNav: item.showInNav
          }));
        
        setNavigationItems(unifiedAdminItems);
        return;
      }
      
      // Handle other navigation types here
      // This would be expanded with real navigation data from your existing implementation
      setNavigationItems([]);
    };
    
    determineNavigationItems();
  }, [navigationType, userType]);

  // Helper function to check if a path is active
  const isPathActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    
    // Handle dynamic segments - treat /profile and /profile/settings as matches for /profile
    if (path !== '/' && location.pathname.startsWith(path)) {
      // Special case for routes with similar prefixes
      const nextCharInPath = location.pathname.charAt(path.length);
      return nextCharInPath === '' || nextCharInPath === '/' || nextCharInPath === '?';
    }
    
    return false;
  };

  // Helper function to get user profile path
  const getProfilePath = (): string => {
    switch (userType) {
      case 'establishment':
        return '/establishment/profile';
      case 'promoter':
        return '/promoter/profile';
      case 'admin':
        return '/admin/profile';
      default:
        return '/profile';
    }
  };

  return (
    <NavigationContext.Provider 
      value={{ 
        navigationType, 
        userType, 
        navigationItems,
        isPathActive,
        getProfilePath
      }}
    >
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
