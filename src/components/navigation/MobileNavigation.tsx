
import React, { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { MobileNavigationProps } from './mobile/types';
import ProfileMenu from './mobile/ProfileMenu';
import NavigationBar from './mobile/NavigationBar';
import { useMobileNavigation } from './hooks/useMobileNavigation';
import { useNavigation } from '@/contexts/NavigationContext';

interface ExtendedMobileNavigationProps extends MobileNavigationProps {
  forceGuestNavigation?: boolean;
}

const MobileNavigation: React.FC<ExtendedMobileNavigationProps> = React.memo(({ 
  type, 
  userType = 'individual',
  forceGuestNavigation = false
}) => {
  const location = useLocation();
  const { goToHomePage } = useAppNavigation();
  const { navigationItems, userType: contextUserType, isAuthenticated } = useNavigation();
  
  const effectiveUserType = contextUserType || 'individual';
  const mobileUserType = useMemo(() => {
    if (!effectiveUserType || effectiveUserType === 'admin') {
      return 'individual';
    }
    return effectiveUserType;
  }, [effectiveUserType]);
  
  const profileUserType = useMemo((): 'individual' | 'establishment' | 'promoter' | 'admin' => {
    if (effectiveUserType === 'admin') return 'admin';
    if (effectiveUserType === 'establishment') return 'establishment';
    if (effectiveUserType === 'promoter') return 'promoter';
    return 'individual';
  }, [effectiveUserType]);
  
  const {
    expanded,
    toggleExpand,
    getProfilePath,
  } = useMobileNavigation(type, profileUserType, forceGuestNavigation);

  const handleHomeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const targetUserType = !effectiveUserType ? 'individual' : effectiveUserType;
    goToHomePage(targetUserType);
  }, [goToHomePage, effectiveUserType]);

  const handleProfileClick = useCallback((item: any, e: React.MouseEvent) => {
    if (item.path === getProfilePath() && shouldShowProfileItems) {
      e.preventDefault();
      toggleExpand();
    }
  }, [getProfilePath, toggleExpand]);

  const shouldShowProfileItems = useMemo(() => {
    return type === 'user' && 
      ((location.pathname === '/profile' || location.pathname.startsWith('/profile/')) ||
       (effectiveUserType === 'establishment' && 
        (location.pathname === '/establishment' || location.pathname.startsWith('/establishment/'))));
  }, [type, location.pathname, effectiveUserType]);

  const hiddenNavPaths = useMemo(() => ['/admin/login'], []);

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
        currentUserType={mobileUserType}
      />
    </>
  );
});

MobileNavigation.displayName = 'MobileNavigation';

export default MobileNavigation;
