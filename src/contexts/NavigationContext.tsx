
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { NavigationType, UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { Home, Map, User, Route, Megaphone, BarChart2, Building, Bell, Calendar, Ticket, BookOpen, LogIn, UserPlus, Banknote } from 'lucide-react';

interface NavigationContextType {
  navigationType: NavigationType;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin';
  navigationItems: UnifiedNavItem[];
  isPathActive: (path: string) => boolean;
  getProfilePath: () => string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const getIndividualNavItems = (getProfilePath: () => string): UnifiedNavItem[] => [
  { icon: Home, label: 'Explore', path: '/explore' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: Route, label: 'Swig Circuits', path: '/swig-circuits' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Ticket, label: 'My Tickets', path: '/profile/my-tickets' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: getProfilePath() },
];

const getEstablishmentNavItems = (getProfilePath: () => string): UnifiedNavItem[] => [
  { icon: Home, label: 'Dashboard', path: '/establishment/dashboard' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: Bell, label: 'Notifications', path: '/establishment/notifications' },
  { icon: BarChart2, label: 'Analytics', path: '/establishment/analytics' },
  { icon: User, label: 'Profile', path: getProfilePath() },
];

const getPromoterNavItems = (getProfilePath: () => string): UnifiedNavItem[] => [
  { icon: Home, label: 'Dashboard', path: '/promoter/dashboard' },
  { icon: Map, label: 'Map', path: '/map' },
  { 
    icon: Route, 
    label: 'Create', 
    path: '#',
    dropdown: {
      items: [
        { label: 'Event', path: '/promoter/events/create' },
        { label: 'Bar Crawl', path: '/create-bar-crawl' }
      ]
    }
  },
  { icon: Building, label: 'Venues', path: '/explore' },
  { icon: Calendar, label: 'Events', path: '/promoter/events' },
  { icon: Bell, label: 'Notifications', path: '/promoter/notifications' },
  { icon: BarChart2, label: 'Analytics', path: '/promoter/analytics' },
  { icon: User, label: 'Profile', path: getProfilePath() },
];

const getGuestNavItems = (): UnifiedNavItem[] => [
  { icon: Home, label: 'Home', path: '/landing' },
  { icon: BookOpen, label: 'Our Mission', path: '/mission' },
  { icon: Banknote, label: 'Pricing', path: '/pricing' },
  { icon: LogIn, label: 'Login', path: '/login' },
  { icon: UserPlus, label: 'Sign Up', path: '/signup' },
];

const getAdminNavItems = (): UnifiedNavItem[] => [
  { icon: Home, label: 'System', path: '/admin/system-breakdown' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
  { icon: Building, label: 'Establishments', path: '/admin/establishments' },
  { icon: User, label: 'Users', path: '/admin/users' },
];

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [navigationType, setNavigationType] = useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [navigationItems, setNavigationItems] = useState<UnifiedNavItem[]>([]);

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
      const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing'];
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
      if (navigationType === NavigationType.ADMIN || userType === 'admin') {
        setNavigationItems(getAdminNavItems());
        return;
      }
      
      if (navigationType === NavigationType.GUEST) {
        setNavigationItems(getGuestNavItems());
        return;
      }
      
      // Handle authenticated user navigation
      switch (userType) {
        case 'establishment':
          setNavigationItems(getEstablishmentNavItems(getProfilePath));
          break;
        case 'promoter':
          setNavigationItems(getPromoterNavItems(getProfilePath));
          break;
        case 'individual':
        default:
          setNavigationItems(getIndividualNavItems(getProfilePath));
          break;
      }
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
