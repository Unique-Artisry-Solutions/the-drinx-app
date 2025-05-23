
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { NavigationType, UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { Home, Map, User, Bell, Ticket } from 'lucide-react';

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
      // Handle admin navigation
      if (navigationType === NavigationType.ADMIN || userType === 'admin') {
        const unifiedAdminItems: UnifiedNavItem[] = [
          { label: 'Dashboard', path: '/admin/system-breakdown', icon: Home, showInNav: true },
          { label: 'Users', path: '/admin/users', icon: User, showInNav: true },
          { label: 'Analytics', path: '/admin/analytics', icon: Map, showInNav: true },
        ];
        setNavigationItems(unifiedAdminItems);
        return;
      }
      
      // Handle user navigation based on user type
      if (navigationType === NavigationType.USER) {
        let userNavItems: UnifiedNavItem[] = [];
        
        if (userType === 'establishment') {
          userNavItems = [
            { label: 'Home', path: '/establishment/dashboard', icon: Home, showInNav: true },
            { label: 'Notifications', path: '/establishment/notifications', icon: Bell, showInNav: true },
            { label: 'Profile', path: '/establishment/profile', icon: User, showInNav: true }
          ];
        } else if (userType === 'promoter') {
          userNavItems = [
            { label: 'Home', path: '/promoter/dashboard', icon: Home, showInNav: true },
            { label: 'Notifications', path: '/promoter/notifications', icon: Bell, showInNav: true },
            { label: 'Profile', path: '/promoter/profile', icon: User, showInNav: true }
          ];
        } else {
          // Individual user navigation
          userNavItems = [
            { label: 'Explore', path: '/explore', icon: Home, showInNav: true },
            { label: 'Map', path: '/map', icon: Map, showInNav: true },
            { label: 'My Tickets', path: '/profile/my-tickets', icon: Ticket, showInNav: true },
            { label: 'Notifications', path: '/notifications', icon: Bell, showInNav: true },
            { label: 'Profile', path: '/profile', icon: User, showInNav: true }
          ];
        }
        
        setNavigationItems(userNavItems);
        return;
      }
      
      // Guest navigation
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
