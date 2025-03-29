
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationTypes, { NavigationType } from './navigation/NavigationTypes';
import MobileNavigation from './navigation/MobileNavigation';
import FloatingCartIndicator from './cart/FloatingCartIndicator';
import Cart from './cart/Cart';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [navigationType, setNavigationType] = useState<NavigationType>(NavigationType.GUEST);
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    return interiorPaths.some(path => location.pathname.startsWith(path)) || 
           location.pathname === '/' && navigationType !== NavigationType.GUEST;
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-material-background">
      {/* Only show navigation for interior app pages */}
      {isInteriorPage() && <NavigationTypes type={navigationType} userType={userType} />}
      
      <main className={`flex-1 pb-16 md:pb-6 pt-2 w-full ${isInteriorPage() ? 'px-2 md:px-6 container max-w-5xl mx-auto' : ''}`}>
        {children}
      </main>
      
      {/* Show floating cart indicator on non-interior pages */}
      {!isInteriorPage() && (
        <FloatingCartIndicator onClick={() => setIsCartOpen(true)} />
      )}
      
      {/* Cart dialog */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <MobileNavigation type={navigationType} userType={userType} />
    </div>
  );
};

export default Layout;
