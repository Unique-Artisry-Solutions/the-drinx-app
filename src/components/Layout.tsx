
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationTypes, { NavigationType } from './navigation/NavigationTypes';
import MobileNavigation from './navigation/MobileNavigation';
import CartButton from './cart/CartButton';
import FloatingCartIndicator from './cart/FloatingCartIndicator';
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

  // Determine if current page is an interior app page (protected pages)
  const isInteriorPage = () => {
    const interiorPaths = ['/map', '/add', '/establishment/', '/cocktail/', '/profile'];
    return interiorPaths.some(path => location.pathname.startsWith(path));
  };

  // Determine if we're on the pricing or checkout page
  const isPricingOrCheckout = () => {
    return location.pathname === '/pricing' || location.pathname === '/checkout';
  };

  return (
    <div className="flex flex-col min-h-screen bg-material-background">
      <NavigationTypes type={navigationType} userType={userType} />
      
      {/* Show floating cart button on non-interior pages when user is not authenticated */}
      {!isInteriorPage() && navigationType === NavigationType.GUEST && (
        <div className="fixed bottom-20 right-6 z-30 md:bottom-10">
          <CartButton />
        </div>
      )}
      
      {/* Show floating cart indicator when cart has items */}
      {items.length > 0 && !isPricingOrCheckout() && <FloatingCartIndicator />}
      
      <main className="flex-1 pb-16 md:pb-6 pt-2 px-2 md:px-6 container max-w-5xl mx-auto">
        {children}
      </main>
      
      <MobileNavigation type={navigationType} userType={userType} />
    </div>
  );
};

export default Layout;
