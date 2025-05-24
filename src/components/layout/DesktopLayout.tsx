
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from '../navigation/NavigationTypes';
import AdminTopNavigation from '../navigation/AdminTopNavigation';
import UserTopNavigation from '../navigation/UserTopNavigation';
import GuestTopNavigation from '../navigation/GuestTopNavigation';
import Breadcrumbs from '../navigation/Breadcrumbs';
import AppFooter from '../AppFooter';
import AdminFooter from '../admin/AdminFooter';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useTheme } from '@/contexts/ThemeContext';

interface TabOption {
  value: string;
  label: string;
}

interface DesktopLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  activeTab,
  handleTabChange,
  tabOptions,
  forceGuestNavigation = false
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { 
    user, 
    isAuthenticated, 
    userType, 
    isLoading, 
    isUsingDevBypass 
  } = useDevAuthBypass();
  
  const [navigationType, setNavigationType] = React.useState<NavigationType>(NavigationType.GUEST);

  useEffect(() => {
    const checkAuth = () => {
      console.log('DesktopLayout - Auth state check:', {
        isAuthenticated,
        userType,
        isUsingDevBypass,
        location: location.pathname,
        forceGuestNavigation
      });
      
      // Define public paths that always use guest navigation
      const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing'];
      const isPublicPath = publicPaths.includes(location.pathname) || forceGuestNavigation;
      
      // Determine navigation type based on effective auth state and path
      if (userType === 'admin' && isAuthenticated) {
        setNavigationType(NavigationType.ADMIN);
      } else if (isAuthenticated && !isPublicPath) {
        setNavigationType(NavigationType.USER);
      } else {
        setNavigationType(NavigationType.GUEST);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, userType, location.pathname, forceGuestNavigation, isUsingDevBypass]);

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || forceGuestNavigation;
  const isAdminPage = location.pathname.startsWith('/admin');

  const getContentPadding = () => {
    if (isLandingPage) {
      return 'pt-16 pb-0 px-0';
    } else {
      return 'pt-20 pb-6 px-4';
    }
  };

  // Determine whether to show guest navigation
  const useGuestNavigation = () => {
    if (forceGuestNavigation) return true;
    
    // Always use guest navigation for non-authenticated users
    if (!isAuthenticated) return true;
    
    // For authenticated users, use guest navigation only on explicit public paths
    const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing'];
    return publicPaths.includes(location.pathname);
  };

  const renderNavigation = () => {
    // Always show admin navigation for admin pages or admin users
    if (isAdminPage || userType === 'admin') {
      return <AdminTopNavigation />;
    } 
    
    // For authenticated users on non-public pages, show appropriate navigation
    else if (isAuthenticated && !useGuestNavigation()) {
      return <UserTopNavigation activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
    } 
    
    // Default to guest navigation for public pages or when not authenticated
    else {
      return <GuestTopNavigation />;
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

  // Render the appropriate footer based on the page type
  const renderFooter = () => {
    if (isAdminPage || userType === 'admin') {
      return <AdminFooter />;
    }
    return <AppFooter />;
  };

  // Debug navigation state - remove in production
  useEffect(() => {
    console.log('DesktopLayout - Navigation state:', {
      path: location.pathname,
      userType,
      isAuthenticated, 
      navigationType,
      useGuestNav: useGuestNavigation(),
      isUsingDevBypass
    });
  }, [location.pathname, userType, isAuthenticated, navigationType, isUsingDevBypass]);

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
      
      {renderFooter()}
    </div>
  );
};

export default DesktopLayout;
