
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from '../navigation/NavigationTypes';
import AdminTopNavigation from '../navigation/AdminTopNavigation';
import UserTopNavigation from '../navigation/UserTopNavigation';
import GuestTopNavigation from '../navigation/GuestTopNavigation';
import Breadcrumbs from '../navigation/Breadcrumbs';
import AppFooter from '../AppFooter';
import AdminFooter from '../admin/AdminFooter';
import { useAuth } from '@/contexts/auth';
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
  const { user, isEmailVerified } = useAuth();
  const [navigationType, setNavigationType] = React.useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = React.useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [isAdmin, setIsAdmin] = React.useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      const userTypeStored = localStorage.getItem('user_type');
      
      setIsAdmin(isAdminAuth);
      
      if (userTypeStored === 'establishment') {
        setUserType('establishment');
      } else if (userTypeStored === 'promoter') {
        setUserType('promoter');
      } else {
        setUserType('individual');
      }
      
      // Define public paths that always use guest navigation
      // Removed '/explore' from this list
      const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
      const isPublicPath = publicPaths.includes(location.pathname) || forceGuestNavigation;
      
      // Determine navigation type based on auth state and path
      if (isAdminAuth) {
        setNavigationType(NavigationType.ADMIN);
      } else if (user && isEmailVerified && !isPublicPath) {
        setNavigationType(NavigationType.USER);
      } else {
        setNavigationType(NavigationType.GUEST);
      }
    };
    
    checkAuth();
  }, [user, isEmailVerified, location.pathname, forceGuestNavigation]);

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || forceGuestNavigation;
  const isAdminPage = location.pathname.startsWith('/admin');
  const isSettingsPage = location.pathname === '/settings';
  const isEstablishmentPage = location.pathname.startsWith('/establishment');
  const isPromoterPage = location.pathname.startsWith('/promotion') || location.pathname === '/analytics';

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
    if (!user) return true;
    
    // For authenticated users, use guest navigation only on explicit public paths
    // Removed '/explore' from this list
    const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
    return publicPaths.includes(location.pathname);
  };

  const renderNavigation = () => {
    // Always show admin navigation for admin pages or admin users
    if (isAdminPage || isAdmin) {
      return <AdminTopNavigation />;
    } 
    
    // For authenticated users on non-public pages, show appropriate navigation
    else if (user && !useGuestNavigation()) {
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
    if (isAdminPage || isAdmin) {
      return <AdminFooter />;
    }
    return <AppFooter />;
  };

  // Debug navigation state - remove in production
  useEffect(() => {
    console.log('Navigation state:', {
      path: location.pathname,
      isAdmin,
      isAuthenticated: !!user, 
      isEmailVerified,
      navigationType,
      useGuestNav: useGuestNavigation()
    });
  }, [location.pathname, user, isAdmin, isEmailVerified]);

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
