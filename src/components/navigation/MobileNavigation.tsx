
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationType } from './NavigationTypes';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { MobileNavigationProps } from './mobile/types';
import { getGuestNavItems, getCartGuestNavItems } from './mobile/GuestNavItems';
import { getUserNavItems } from './mobile/UserNavItems';
import { getAdminNavItems } from './mobile/AdminNavItems';
import ProfileMenu from './mobile/ProfileMenu';
import NavItem from './mobile/NavItem';
import HomeButton from './mobile/HomeButton';

interface ExtendedMobileNavigationProps extends MobileNavigationProps {
  forceGuestNavigation?: boolean;
}

const MobileNavigation: React.FC<ExtendedMobileNavigationProps> = ({ 
  type, 
  userType = 'individual',
  forceGuestNavigation = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentUserType, setCurrentUserType] = useState<'individual' | 'establishment' | 'promoter'>(userType);
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  
  // Update user type from localStorage whenever it changes
  useEffect(() => {
    const userTypeFromStorage = localStorage.getItem('user_type');
    if (userTypeFromStorage === 'establishment') {
      setCurrentUserType('establishment');
    } else if (userTypeFromStorage === 'promoter') {
      setCurrentUserType('promoter');
    } else {
      setCurrentUserType('individual');
    }
    
    console.log('MobileNavigation: userType updated', { 
      fromStorage: userTypeFromStorage, 
      current: currentUserType,
      user: !!user,
      type: type
    });
  }, [user, location.pathname, type]); // Re-check when user or path changes

  // Add effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Debug output to help diagnose navigation issues
  useEffect(() => {
    console.log('MobileNavigation Rendered:', { 
      type, 
      userType: currentUserType, 
      user: !!user,
      forceGuestNavigation,
      path: location.pathname,
      navItems: getNavItems().map(item => item.label)
    });
  }, [type, currentUserType, user, forceGuestNavigation, location.pathname]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (user) {
      if (currentUserType === 'establishment') {
        navigate('/establishment/dashboard');
      } else if (currentUserType === 'promoter') {
        navigate('/promoter/dashboard');
      } else {
        navigate('/explore');
      }
    } else {
      navigate('/landing');
    }
    
    window.scrollTo(0, 0);
  };

  const getProfilePath = () => {
    return currentUserType === 'establishment' ? '/establishment/profile' : '/profile';
  };

  const getNavItems = () => {
    // Check for admin login page first
    if (location.pathname === '/admin' || location.pathname === '/admin/login') {
      return getGuestNavItems();
    }
    
    // If forceGuestNavigation is true, always show guest navigation
    if (forceGuestNavigation) {
      return getGuestNavItems();
    }
    
    // If user is not authenticated, always show guest navigation
    if (!user) {
      return getGuestNavItems();
    }
    
    // Define public paths that should always show guest navigation
    const publicPaths = ['/', '/landing', '/login', '/signup', '/mission'];
    
    // Special case for public paths - show guest navigation
    if (publicPaths.includes(location.pathname)) {
      return getGuestNavItems();
    }
    
    // Special case for cart page
    if (location.pathname === '/cart') {
      return getCartGuestNavItems();
    }

    // Check for admin routes
    if (location.pathname.startsWith('/admin/')) {
      return getAdminNavItems();
    }

    // Check for establishment or promoter user paths
    if (currentUserType === 'establishment' || currentUserType === 'promoter') {
      return getUserNavItems(currentUserType, getProfilePath);
    }
    
    // For individual users and other cases, always use the user type
    return getUserNavItems(currentUserType, getProfilePath);
  };

  const navItems = getNavItems();
  
  const shouldShowProfileItems = 
    type === NavigationType.USER && 
    ((location.pathname === '/profile' || location.pathname.startsWith('/profile/')) ||
     (currentUserType === 'establishment' && 
      (location.pathname === '/establishment' || location.pathname.startsWith('/establishment/'))));
     
  // Pages that should not show the mobile navigation
  const hiddenNavPaths = ['/admin/login'];

  // Check if we should hide the navigation entirely
  if (hiddenNavPaths.includes(location.pathname)) {
    return null;
  }

  const navBarClasses = theme === 'dark' 
    ? "fixed bottom-0 left-0 right-0 w-full bg-gray-900 shadow-lg z-50 md:hidden border-t border-gray-700 backdrop-blur-sm bg-gray-900/95 transition-all duration-300" 
    : currentUserType === 'promoter'
      ? "fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg z-50 md:hidden border-t border-purple-200 backdrop-blur-sm bg-white/95 transition-all duration-300"
      : "fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg z-50 md:hidden border-t border-gray-100 backdrop-blur-sm bg-white/95 transition-all duration-300";

  return (
    <>
      <ProfileMenu expanded={shouldShowProfileItems && expanded} userType={currentUserType} />
      <nav className={navBarClasses}>
        <div className="mx-auto w-full">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item, index) => {
              const isActive = 
                location.pathname === item.path || 
                (item.path === '/profile' && location.pathname.startsWith('/profile/')) ||
                (item.path === '/establishment/dashboard' && 
                  (location.pathname.startsWith('/establishment/') || location.pathname === '/establishment'));
              
              if (item.label === 'Home' && type === NavigationType.USER) {
                return (
                  <HomeButton
                    key="home"
                    isActive={isActive}
                    onClick={handleHomeClick}
                    isPromoter={currentUserType === 'promoter'}
                  />
                );
              }
              
              const handleClick = (e: React.MouseEvent) => {
                if (item.path === getProfilePath() && shouldShowProfileItems) {
                  e.preventDefault();
                  toggleExpand();
                }
              };
              
              return (
                <NavItem
                  key={item.path}
                  item={item}
                  isActive={isActive}
                  onClick={handleClick}
                  isPromoter={currentUserType === 'promoter'}
                />
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
