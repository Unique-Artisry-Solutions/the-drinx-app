
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Plus, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationType } from './NavigationTypes';

interface NavItem {
  icon: React.FC<any>;
  label: string;
  path: string;
}

interface MobileNavigationProps {
  type: NavigationType;
  userType?: 'individual' | 'establishment';
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  type, 
  userType = 'individual' 
}) => {
  const location = useLocation();
  const [currentUserType, setCurrentUserType] = useState(userType);
  
  useEffect(() => {
    // Get the user type from localStorage to ensure it's up to date
    const type = localStorage.getItem('user_type');
    if (type === 'establishment') {
      setCurrentUserType('establishment');
    } else {
      setCurrentUserType('individual');
    }
  }, []);

  // Guest Navigation Items
  const guestNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/landing' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { icon: User, label: 'Login', path: '/login' },
  ];

  // Get the correct profile path based on user type
  const getProfilePath = () => {
    return currentUserType === 'establishment' ? '/establishment/profile' : '/profile';
  };

  // User Navigation Items
  const userNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
    { icon: User, label: 'Profile', path: getProfilePath() },
  ];

  // Admin Navigation Items
  const adminNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
    { icon: User, label: 'Admin', path: '/admin' },
  ];

  const getNavItems = () => {
    switch (type) {
      case NavigationType.GUEST:
        return guestNavItems;
      case NavigationType.USER:
        return userNavItems;
      case NavigationType.ADMIN:
        return adminNavItems;
      default:
        return guestNavItems;
    }
  };

  const navItems = getNavItems();

  // Don't render the mobile nav on landing or admin pages
  if (location.pathname === '/landing' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="spiritless-mobile-nav fixed bottom-0 w-full bg-white shadow-lg z-50 md:hidden">
      <div className="spiritless-mobile-container max-w-5xl mx-auto">
        <div className="spiritless-mobile-inner flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "spiritless-mobile-link flex flex-col items-center justify-center w-full h-full transition-all-200",
                  isActive 
                    ? "text-material-primary" 
                    : "text-material-on-surface-variant"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  isActive && "animate-pulse-subtle"
                )}>
                  <item.icon size={24} />
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavigation;
