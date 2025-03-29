
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from './navigation/NavigationTypes';
import MobileNavigation from './navigation/MobileNavigation';
import AdminTopNavigation from './navigation/AdminTopNavigation';
import UserTopNavigation from './navigation/UserTopNavigation';
import GuestTopNavigation from './navigation/GuestTopNavigation';
import { useCart } from '@/contexts/CartContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [navigationType, setNavigationType] = useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  const [isAdmin, setIsAdmin] = useState(false);
  const { items } = useCart();
  const hasCartItems = items.length > 0;

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

  const isLandingPage = location.pathname === '/landing';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const getContentPadding = () => {
    if (isLandingPage) {
      return hasCartItems ? 'pt-16 pb-0 px-0' : 'pt-0 pb-0 px-0';
    } else {
      return 'pt-20 pb-20 md:pb-6 px-4';
    }
  };

  const renderNavigation = () => {
    if (isAdminPage || isAdmin) {
      return <AdminTopNavigation />;
    } else if (navigationType === NavigationType.USER) {
      return <UserTopNavigation />;
    } else if (isLandingPage) {
      return hasCartItems ? <GuestTopNavigation /> : null;
    } else {
      return <GuestTopNavigation />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-material-background w-full">
      {renderNavigation()}
      
      <main className={`flex-1 w-full ${getContentPadding()}`}>
        {children}
      </main>
      
      {!isLandingPage && (
        <MobileNavigation type={navigationType} userType={userType} />
      )}
    </div>
  );
};

export default Layout;
