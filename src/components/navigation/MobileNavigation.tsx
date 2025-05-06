
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { MobileNavigationProps } from './mobile/types';
import ProfileMenu from './mobile/ProfileMenu';
import NavigationBar from './mobile/NavigationBar';
import { useMobileNavigation } from './hooks/useMobileNavigation';
import { getNavItems } from './utils/navigationItems';

interface ExtendedMobileNavigationProps extends MobileNavigationProps {
  forceGuestNavigation?: boolean;
}

const MobileNavigation: React.FC<ExtendedMobileNavigationProps> = ({ 
  type, 
  userType = 'individual',
  forceGuestNavigation = false
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const { goToHomePage } = useAppNavigation();
  const {
    currentUserType,
    expanded,
    toggleExpand,
    getProfilePath,
  } = useMobileNavigation(type, userType, forceGuestNavigation);

  // Create a handleHomeClick that uses the new navigation hook
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goToHomePage(currentUserType);
  };

  const handleProfileClick = (item: any, e: React.MouseEvent) => {
    if (item.path === getProfilePath() && shouldShowProfileItems) {
      e.preventDefault();
      toggleExpand();
    }
  };

  const navItems = getNavItems(
    type,
    currentUserType,
    forceGuestNavigation,
    user,
    location,
    getProfilePath
  );

  const shouldShowProfileItems = 
    type === 'user' && 
    ((location.pathname === '/profile' || location.pathname.startsWith('/profile/')) ||
     (currentUserType === 'establishment' && 
      (location.pathname === '/establishment' || location.pathname.startsWith('/establishment/'))));

  const hiddenNavPaths = ['/admin/login'];

  if (hiddenNavPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <ProfileMenu 
        expanded={shouldShowProfileItems && expanded} 
        userType={currentUserType} 
      />
      <NavigationBar
        navItems={navItems}
        type={type}
        handleHomeClick={handleHomeClick}
        handleProfileClick={handleProfileClick}
        getProfilePath={getProfilePath}
        currentUserType={currentUserType}
      />
    </>
  );
};

export default MobileNavigation;
