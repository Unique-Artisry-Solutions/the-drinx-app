
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from './navigation/NavigationTypes';
import MobileNavigation from './navigation/MobileNavigation';
import AdminTopNavigation from './navigation/AdminTopNavigation';
import UserTopNavigation from './navigation/UserTopNavigation';
import GuestTopNavigation from './navigation/GuestTopNavigation';
import BackButton from './navigation/BackButton';
import AppFooter from './AppFooter';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isEmailVerified } = useAuth();
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
  
  // Determine which pages should not show a back button
  const shouldShowBackButton = () => {
    // Don't show back button on landing, home, main app pages, or pages with their own back implementation
    const topLevelPaths = ['/', '/landing', '/map', '/explore', '/login', '/signup', '/mission', 
                          '/resources', '/legal', '/admin', '/admin/dashboard', '/profile'];
                          
    // Pages that implement their own back buttons
    const pagesWithOwnBackButtons = [
      '/profile/bar-crawls',
      '/bar-crawl-profile',
      '/profile/favorites',
      '/profile/visited'
    ];
    
    // Check if the current path is a subpath of any path in pagesWithOwnBackButtons
    const hasOwnBackButton = pagesWithOwnBackButtons.some(path => 
      location.pathname.startsWith(path) || location.pathname === path
    );
    
    return !topLevelPaths.includes(location.pathname) && !isLandingPage && !hasOwnBackButton;
  };
  
  const getContentPadding = () => {
    if (isLandingPage) {
      return 'pt-16 pb-0 px-0';
    } else if (isMobile) {
      return 'pt-16 pb-24 px-3'; // Adjusted padding for mobile
    } else {
      return 'pt-20 pb-20 md:pb-6 px-4';
    }
  };

  const renderNavigation = () => {
    if (isAdminPage || isAdmin) {
      return <AdminTopNavigation />;
    } else if (navigationType === NavigationType.USER) {
      return <UserTopNavigation />;
    } else {
      // Only show GuestTopNavigation on the landing page or for unauthenticated users on non-interior pages
      if (isLandingPage || (!user && (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/mission'))) {
        return <GuestTopNavigation />;
      } else {
        // For other interior pages when not authenticated, still show UserTopNavigation
        return <UserTopNavigation />;
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-material-background w-full">
      {renderNavigation()}
      
      <main className={`flex-1 w-full max-w-full overflow-x-hidden ${getContentPadding()}`}>
        {shouldShowBackButton() && (
          <div className="container max-w-6xl mx-auto px-4 pt-4">
            <BackButton />
          </div>
        )}
        {children}
      </main>
      
      {/* Show AppFooter on interior pages, not on landing page */}
      {!isLandingPage && !isMobile && <AppFooter />}
      
      {!isLandingPage && (
        <MobileNavigation type={navigationType} userType={userType} />
      )}
    </div>
  );
};

export default Layout;
