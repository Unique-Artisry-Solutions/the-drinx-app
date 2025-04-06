
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
    const type = localStorage.getItem('user_type');
    if (type === 'establishment') {
      setCurrentUserType('establishment');
    } else {
      setCurrentUserType('individual');
    }
  }, []);

  // Add effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (user) {
      if (currentUserType === 'establishment') {
        navigate('/establishment/all-actions');
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
  
  const shouldShowProfileItems = 
    type === NavigationType.USER && 
    (location.pathname === '/profile' || 
     location.pathname.startsWith('/profile/'));

  if (location.pathname === '/landing' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg z-50 md:hidden border-t border-gray-100 backdrop-blur-sm bg-white/95 transition-all duration-300">
      <ProfileMenu expanded={shouldShowProfileItems && expanded} />
      <div className="mx-auto w-full">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/profile' && location.pathname.startsWith('/profile/')) ||
              (item.path === '/establishment/all-actions' && location.pathname.startsWith('/establishment/'));
            
            if (item.label === 'Home' && type === NavigationType.USER) {
              return (
                <HomeButton
                  key="home"
                  isActive={isActive}
                  onClick={handleHomeClick}
                />
              );
            }
            
            const handleClick = (e: React.MouseEvent) => {
              if (item.path === getProfilePath() && shouldShowProfileItems) {
                e.preventDefault();
                toggleExpand();
              } else {
                // Scroll to top when navigating
                window.scrollTo(0, 0);
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
