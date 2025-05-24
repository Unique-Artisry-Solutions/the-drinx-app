
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { MobileNavigationProps } from './mobile/types';
import ProfileMenu from './mobile/ProfileMenu';
import NavigationBar from './mobile/NavigationBar';
import { useMobileNavigation } from './hooks/useMobileNavigation';
import { useNavigation } from '@/contexts/NavigationContext';

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
  const { navigationItems, userType: currentUserType } = useNavigation();
  
  // Convert admin to individual for mobile navigation components that don't support admin
  const mobileUserType = currentUserType === 'admin' ? 'individual' : currentUserType;
  const profileUserType = userType === 'admin' ? 'individual' : userType;
  
  const {
    expanded,
    toggleExpand,
    getProfilePath,
  } = useMobileNavigation(type, profileUserType, forceGuestNavigation);

  // Create a handleHomeClick that uses the navigation hook and prevents default
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
        userType={mobileUserType} 
      />
      <NavigationBar
        navItems={navigationItems}
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
