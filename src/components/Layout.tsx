
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from './navigation/NavigationTypes';
import MobileNavigation from './navigation/MobileNavigation';
import AdminTopNavigation from './navigation/AdminTopNavigation';
import UserTopNavigation from './navigation/UserTopNavigation';
import GuestTopNavigation from './navigation/GuestTopNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [navigationType, setNavigationType] = useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      const userTypeStored = localStorage.getItem('user_type');

      if (isAdminAuth) {
        setNavigationType(NavigationType.ADMIN);
        setIsAdmin(true);
      } else if (isAuthenticated) {
        setNavigationType(NavigationType.USER);
        setUserType(userTypeStored === 'establishment' ? 'establishment' : 'individual');
      } else {
        setNavigationType(NavigationType.GUEST);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Determine if we're on a landing page (show guest nav) or interior page (show appropriate nav)
  const isLandingPage = location.pathname === '/landing';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Calculate content padding based on the page type
  const getContentPadding = () => {
    if (isLandingPage) {
      return 'pt-0 pb-0 px-0'; // No padding for landing page
    } else {
      return 'pt-20 pb-20 md:pb-6 px-4'; // Padding for top and bottom nav on interior pages
    }
  };

  // Render the appropriate navigation based on user type and page
  const renderNavigation = () => {
    if (isAdminPage || isAdmin) {
      return <AdminTopNavigation />;
    } else if (navigationType === NavigationType.USER) {
      return <UserTopNavigation />;
    } else {
      return <GuestTopNavigation />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-material-background w-full">
      {/* Render the appropriate top navigation */}
      {renderNavigation()}
      
      {/* Main content with dynamic padding */}
      <main className={`flex-1 w-full ${getContentPadding()}`}>
        {children}
      </main>
      
      {/* Mobile Navigation for interior app pages */}
      {!isLandingPage && (
        <MobileNavigation type={navigationType} userType={userType} />
      )}
    </div>
  );
};

export default Layout;
