
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationType } from './NavigationTypes';
import { useAuth } from '@/contexts/auth';
import { MobileNavigationProps } from './mobile/types';
import { getGuestNavItems } from './mobile/GuestNavItems';
import { getUserNavItems } from './mobile/UserNavItems';
import { getAdminNavItems } from './mobile/AdminNavItems';
import ProfileMenu from './mobile/ProfileMenu';
import NavItem from './mobile/NavItem';
import HomeButton from './mobile/HomeButton';

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

  // Get the correct profile path based on user type
  const getProfilePath = () => {
    return currentUserType === 'establishment' ? '/establishment/profile' : '/profile';
  };

  const getNavItems = () => {
    switch (type) {
      case NavigationType.GUEST:
        return getGuestNavItems();
      case NavigationType.USER:
        return getUserNavItems(currentUserType, getProfilePath);
      case NavigationType.ADMIN:
        return getAdminNavItems();
      default:
        return getGuestNavItems();
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
      <ProfileMenu expanded={shouldShowProfileItems && expanded} />
      <div className="mx-auto w-full">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/profile' && location.pathname.startsWith('/profile/'));
            
            // Special case for Home button to prevent session problems
            if (item.label === 'Home' && type === NavigationType.USER) {
              return (
                <HomeButton
                  key="home"
                  isActive={isActive}
                  onClick={handleHomeClick}
                />
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
              <NavItem
                key={item.path}
                item={item}
                isActive={isActive}
                onClick={handleClick}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavigation;
