
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from '../navigation/NavigationTypes';
import MobileNavigation from '../navigation/MobileNavigation';
import UserNavbar from '../navigation/user/UserNavbar';
import Breadcrumbs from '../navigation/Breadcrumbs';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import GuestTopNavigation from '../navigation/GuestTopNavigation';

interface TabOption {
  value: string;
  label: string;
}

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user, isEmailVerified } = useAuth();
  const [navigationType, setNavigationType] = React.useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = React.useState<'individual' | 'establishment'>('individual');
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = () => {
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      const userTypeStored = localStorage.getItem('user_type');
      
      setIsAdmin(isAdminAuth);
      setUserType(userTypeStored === 'establishment' ? 'establishment' : 'individual');
      
      // Define public paths that always use guest navigation
      const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
      const isPublicPath = publicPaths.includes(location.pathname);
      
      // If on a public path, always use guest navigation
      if (isPublicPath) {
        setNavigationType(NavigationType.GUEST);
        return;
      }
      
      // Determine navigation type based on auth state
      if (isAdminAuth) {
        setNavigationType(NavigationType.ADMIN);
      } else if (user && isEmailVerified) {
        setNavigationType(NavigationType.USER);
      } else {
        setNavigationType(NavigationType.GUEST);
      }
    };
    
    checkAuth();
  }, [user, isEmailVerified, location.pathname]);

  // Determine page types for specialized navigation
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isPublicPage = isLandingPage || isAuthPage || location.pathname === '/mission';

  const getContentPadding = () => {
    if (isLandingPage) {
      return 'pt-16 pb-0';
    } else {
      return 'pt-16 pb-20';
    }
  };

  // Refined shouldShowBreadcrumbs logic
  const shouldShowBreadcrumbs = () => {
    // List of paths where breadcrumbs should not be shown
    const excludedPaths = [
      '/', 
      '/landing', 
      '/login', 
      '/signup', 
      '/mission', 
      '/map', 
      '/explore'
    ];
    
    // Don't show breadcrumbs on excluded paths
    if (excludedPaths.includes(location.pathname)) {
      return false;
    }
    
    // Don't show on landing page or admin login page
    if (isLandingPage || location.pathname === '/admin/login') {
      return false;
    }
    
    return true;
  };

  // Determine if mobile navigation bar should be shown
  const shouldShowMobileNav = () => {
    return !isAdminPage;
  };
  
  // Determine whether to show guest navigation based on public paths and auth state
  const useGuestNavigation = () => {
    const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
    return publicPaths.includes(location.pathname) || !user;
  };

  return (
    <div className={`flex flex-col min-h-screen w-full max-w-full bg-background transition-colors duration-300`}>
      {useGuestNavigation() ? (
        <GuestTopNavigation />
      ) : (
        <UserNavbar activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />
      )}
      
      <main className={`flex-1 w-full max-w-full overflow-x-hidden ${getContentPadding()}`}>
        {shouldShowBreadcrumbs() && (
          <div className="w-full px-3">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </main>
      
      {shouldShowMobileNav() && (
        <MobileNavigation type={navigationType} userType={userType} />
      )}
    </div>
  );
};

export default MobileLayout;
