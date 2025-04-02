
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Plus, ShoppingCart, User, Star, CheckSquare, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationType } from './NavigationTypes';
import { useAuth } from '@/contexts/auth';

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
  const navigate = useNavigate();
  const [currentUserType, setCurrentUserType] = useState(userType);
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Get the user type from localStorage to ensure it's up to date
    const type = localStorage.getItem('user_type');
    if (type === 'establishment') {
      setCurrentUserType('establishment');
    } else {
      setCurrentUserType('individual');
    }
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Handler for the home button to prevent session issues
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (user) {
      if (currentUserType === 'establishment') {
        navigate('/'); // Establishments go to dashboard
      } else {
        navigate('/explore'); // Individual users go to explore
      }
    } else {
      navigate('/landing'); // Non-authenticated users go to landing
    }
  };

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

  // User Navigation Items (modified to show "Create" for individuals)
  const userNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
  ];
  
  // Add Create for individuals only, removed Add for establishments
  if (currentUserType === 'individual') {
    userNavItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  }
  
  userNavItems.push({ icon: User, label: 'Profile', path: getProfilePath() });

  // Profile Related Items (shown when expanded)
  const profileItems: NavItem[] = [
    { icon: Route, label: 'Bar Crawls', path: '/profile/bar-crawls' },
    { icon: Star, label: 'Favorites', path: '/profile/favorites' },
    { icon: CheckSquare, label: 'Visited', path: '/profile/visited' },
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
  
  // Show profile related items if we're on a profile page and the user is logged in
  const shouldShowProfileItems = 
    type === NavigationType.USER && 
    (location.pathname === '/profile' || 
     location.pathname.startsWith('/profile/'));

  // Don't render the mobile nav on landing or admin pages
  if (location.pathname === '/landing' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg z-50 md:hidden border-t border-gray-100">
      {shouldShowProfileItems && expanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-1 px-2 py-2">
            {profileItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-md",
                    isActive 
                      ? "bg-material-primary/10 text-material-primary" 
                      : "text-material-on-surface-variant hover:bg-gray-100"
                  )}
                >
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <div className="mx-auto w-full">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/profile' && location.pathname.startsWith('/profile/'));
            
            // Special case for Home button to prevent session problems
            if (item.label === 'Home' && type === NavigationType.USER) {
              return (
                <a
                  key={item.path}
                  href="#"
                  onClick={handleHomeClick}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full py-2",
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
                </a>
              );
            }
            
            // If this is the profile button and we're on a profile page, make it toggle the menu
            const handleClick = (e: React.MouseEvent) => {
              if (item.path === getProfilePath() && shouldShowProfileItems) {
                e.preventDefault();
                toggleExpand();
              }
            };
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClick}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full py-2",
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
