
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from '../navigation/NavigationTypes';
import MobileNavigation from '../navigation/MobileNavigation';
import UserNavbar from '../navigation/user/UserNavbar';
import Breadcrumbs from '../navigation/Breadcrumbs';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import GuestTopNavigation from '../navigation/GuestTopNavigation';
import AdminTopNavigation from '../navigation/AdminTopNavigation';
import AppFooter from '../AppFooter';
import AdminFooter from '../admin/AdminFooter';
import { resolveNavigationState, toNonAdminUserType } from '@/utils/navigationResolver';

interface TabOption {
  value: string;
  label: string;
}

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  activeTab,
  handleTabChange,
  tabOptions,
  forceGuestNavigation = false
}) => {
  const location = useLocation();
  const { userType, isAuthenticated } = useDevAuthBypass();
  
  const [effectiveNavState, setEffectiveNavState] = React.useState(() => 
    resolveNavigationState(null, false, location.pathname, forceGuestNavigation)
  );

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const navState = resolveNavigationState(
      userType,
      isAuthenticated,
      location.pathname,
      forceGuestNavigation
    );
    setEffectiveNavState(navState);
  }, [userType, isAuthenticated, location.pathname, forceGuestNavigation]);

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || forceGuestNavigation;
  const isAdminPage = location.pathname.startsWith('/admin');

  const getContentPadding = () => {
    return isLandingPage ? 'pt-16 pb-0' : 'pt-16 pb-20';
  };

  const shouldShowBreadcrumbs = () => {
    const excludedPaths = ['/', '/landing', '/login', '/signup', '/mission', '/map', '/explore'];
    return !excludedPaths.includes(location.pathname) && !isLandingPage && location.pathname !== '/admin/login';
  };

  const shouldShowMobileNav = () => {
    return !isAdminPage;
  };

  const renderNavigation = () => {
    switch (effectiveNavState.navigationType) {
      case NavigationType.ADMIN:
        return <AdminTopNavigation />;
      case NavigationType.USER:
        return <UserNavbar activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
      case NavigationType.GUEST:
      default:
        return <GuestTopNavigation />;
    }
  };
  
  const renderFooter = () => {
    if (isAdminPage || effectiveNavState.userType === 'admin') {
      return <AdminFooter />;
    }
    return !shouldShowMobileNav() ? <AppFooter /> : null;
  };

  const mobileUserType = toNonAdminUserType(effectiveNavState.userType);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background transition-colors duration-300">
      {renderNavigation()}
      
      <main className={`flex-1 w-full ${getContentPadding()}`}>
        {shouldShowBreadcrumbs() && (
          <div className="w-full px-3">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </main>
      
      {renderFooter()}
      
      {shouldShowMobileNav() && (
        <MobileNavigation 
          type={effectiveNavState.navigationType} 
          userType={mobileUserType} 
          forceGuestNavigation={forceGuestNavigation} 
        />
      )}
    </div>
  );
};

export default MobileLayout;
