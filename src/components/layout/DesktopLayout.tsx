
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from '../navigation/NavigationTypes';
import AdminTopNav from '../navigation/admin/AdminTopNav';
import UserNavbar from '../navigation/user/UserNavbar';
import GuestTopNavigation from '../navigation/GuestTopNavigation';
import Breadcrumbs from '../navigation/Breadcrumbs';
import AppFooter from '../AppFooter';
import AdminFooter from '../admin/AdminFooter';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { resolveNavigationState } from '@/utils/navigationResolver';

interface TabOption {
  value: string;
  label: string;
}

interface DesktopLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
    return isLandingPage ? 'pt-16 pb-0 px-0' : 'pt-20 pb-6 px-4';
  };

  const renderNavigation = () => {
    switch (effectiveNavState.navigationType) {
      case NavigationType.ADMIN:
        return <AdminTopNav />;
      case NavigationType.USER:
        return <UserNavbar activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
      case NavigationType.GUEST:
      default:
        return <GuestTopNavigation />;
    }
  };

  const shouldShowBreadcrumbs = () => {
    const excludedPaths = ['/', '/landing', '/login', '/signup', '/mission', '/map', '/explore'];
    return !excludedPaths.includes(location.pathname) && !isLandingPage && location.pathname !== '/admin/login';
  };

  const renderFooter = () => {
    return isAdminPage || effectiveNavState.userType === 'admin' ? <AdminFooter /> : <AppFooter />;
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background transition-colors duration-300">
      {renderNavigation()}
      
      <main className={`flex-1 w-full ${getContentPadding()}`}>
        {shouldShowBreadcrumbs() && (
          <div className="container max-w-6xl mx-auto px-4 pt-2">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </main>
      
      {renderFooter()}
    </div>
  );
};

export default DesktopLayout;
