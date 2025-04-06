
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from './navigation/NavigationTypes';
import MobileNavigation from './navigation/MobileNavigation';
import AdminTopNavigation from './navigation/AdminTopNavigation';
import UserTopNavigation from './navigation/UserTopNavigation';
import GuestTopNavigation from './navigation/GuestTopNavigation';
import Breadcrumbs from './navigation/Breadcrumbs';
import AppFooter from './AppFooter';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

interface TabOption {
  value: string;
  label: string;
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const {
    user,
    isEmailVerified
  } = useAuth();
  const [navigationType, setNavigationType] = React.useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = React.useState<'individual' | 'establishment'>('individual');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuth = () => {
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      const userTypeStored = localStorage.getItem('user_type');
      setIsAdmin(isAdminAuth);
      if (isAdminAuth) {
        setNavigationType(NavigationType.ADMIN);
      } else if (user && isEmailVerified) {
        setNavigationType(NavigationType.USER);
        setUserType(userTypeStored === 'establishment' ? 'establishment' : 'individual');
      } else {
        setNavigationType(NavigationType.GUEST);
      }
    };
    
    checkAuth();
  }, [user, isEmailVerified, location.pathname]);

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
  const isAdminPage = location.pathname.startsWith('/admin');

  const getContentPadding = () => {
    if (isLandingPage) {
      return 'pt-16 pb-0 px-0';
    } else if (isMobile) {
      return 'pt-16 pb-20 px-0'; // Removed horizontal padding and adjusted bottom for mobile
    } else {
      return 'pt-20 pb-20 md:pb-6 px-4';
    }
  };

  const renderNavigation = () => {
    if (isAdminPage || isAdmin) {
      return <AdminTopNavigation />;
    } else if (navigationType === NavigationType.USER) {
      return <UserTopNavigation activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
    } else {
      // Only show GuestTopNavigation on the landing page or for unauthenticated users on non-interior pages
      if (isLandingPage || !user && (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/mission')) {
        return <GuestTopNavigation />;
      } else {
        // For other interior pages when not authenticated, still show UserTopNavigation
        return <UserTopNavigation activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
      }
    }
  };

  // Refined shouldShowBreadcrumbs logic
  const shouldShowBreadcrumbs = () => {
    const excludedPaths = ['/', '/landing', '/login', '/signup', '/mission', '/map', '/explore'];
    
    // Don't show on specifically excluded paths
    if (excludedPaths.includes(location.pathname)) return false;
    
    // Don't show on landing page or admin pages
    if (isLandingPage || isAdminPage) return false;
    
    return true;
  };

  return (
    <div className={`flex flex-col min-h-screen w-full max-w-full bg-background transition-colors duration-300`}>
      {renderNavigation()}
      
      <main className={`flex-1 w-full max-w-full overflow-x-hidden ${getContentPadding()}`}>
        {shouldShowBreadcrumbs() && (
          <div className="container max-w-6xl mx-auto px-4 pt-2">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </main>
      
      {/* Show AppFooter on interior pages, not on landing page */}
      {!isLandingPage && !isMobile && <AppFooter />}
      
      {!isLandingPage && <MobileNavigation type={navigationType} userType={userType} />}
    </div>
  );
};

export default Layout;
