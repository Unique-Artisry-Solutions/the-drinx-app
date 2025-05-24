
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationType } from '../navigation/NavigationTypes';
import MobileNavigation from '../navigation/MobileNavigation';
import UserNavbar from '../navigation/user/UserNavbar';
import Breadcrumbs from '../navigation/Breadcrumbs';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useTheme } from '@/contexts/ThemeContext';
import GuestTopNavigation from '../navigation/GuestTopNavigation';
import AdminTopNavigation from '../navigation/AdminTopNavigation';
import AppFooter from '../AppFooter';
import AdminFooter from '../admin/AdminFooter';

interface TabOption {
  value: string;
  label: string;
}

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  activeTab,
  handleTabChange,
  tabOptions,
  forceGuestNavigation = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { 
    user, 
    isAuthenticated, 
    userType, 
    isLoading, 
    isUsingDevBypass 
  } = useDevAuthBypass();
  
  const [navigationType, setNavigationType] = React.useState<NavigationType>(NavigationType.GUEST);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = () => {
      console.log('MobileLayout - Auth state check:', {
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

  // Determine page types for specialized navigation
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || forceGuestNavigation;
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
  
  // Determine whether to show guest navigation
  const useGuestNavigation = () => {
    if (forceGuestNavigation) return true;
    
    // Always show guest navigation for non-authenticated users
    if (!isAuthenticated) return true;
    
    // For authenticated users, use guest navigation only on explicit public paths
    const publicPaths = ['/', '/landing', '/login', '/signup', '/mission', '/pricing'];
    return publicPaths.includes(location.pathname);
  };

  // Render the appropriate navigation
  const renderNavigation = () => {
    // Always show admin navigation for admin pages or admin users
    if (isAdminPage || userType === 'admin') {
      return <AdminTopNavigation />;
    } 
    
    // For authenticated users on non-public pages, show appropriate navigation
    else if (isAuthenticated && !useGuestNavigation()) {
      return <UserNavbar activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
    } 
    
    // Default to guest navigation
    else {
      return <GuestTopNavigation />;
    }
  };
  
  // Render the appropriate footer
  const renderFooter = () => {
    if (isAdminPage || userType === 'admin') {
      return <AdminFooter />;
    }
    // Only return AppFooter if not showing mobile nav
    return !shouldShowMobileNav() ? <AppFooter /> : null;
  };

  // Convert userType to the format expected by MobileNavigation
  const mobileUserType = userType === 'admin' ? 'individual' : (userType || 'individual');

  return (
    <div className={`flex flex-col min-h-screen w-full max-w-full bg-background transition-colors duration-300`}>
      {renderNavigation()}
      
      <main className={`flex-1 w-full max-w-full overflow-x-hidden ${getContentPadding()}`}>
        {shouldShowBreadcrumbs() && (
          <div className="w-full px-3">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </main>
      
      {renderFooter()}
      
      {shouldShowMobileNav() && (
        <MobileNavigation 
          type={navigationType} 
          userType={mobileUserType} 
          forceGuestNavigation={forceGuestNavigation} 
        />
      )}
    </div>
  );
};

export default MobileLayout;
