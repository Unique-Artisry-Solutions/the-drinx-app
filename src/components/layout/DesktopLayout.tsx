
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationType } from '../navigation/NavigationTypes';
import AdminTopNavigation from '../navigation/AdminTopNavigation';
import UserTopNavigation from '../navigation/UserTopNavigation';
import GuestTopNavigation from '../navigation/GuestTopNavigation';
import Breadcrumbs from '../navigation/Breadcrumbs';
import AppFooter from '../AppFooter';
import AdminFooter from '../admin/AdminFooter';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();
  const { 
    user, 
    isAuthenticated, 
    userType, 
    isLoading, 
    isUsingDevBypass 
  } = useDevAuthBypass();
  
  const [effectiveNavState, setEffectiveNavState] = React.useState(() => 
    resolveNavigationState(
      null, false, null, false, false, location.pathname, forceGuestNavigation
    )
  );

  useEffect(() => {
    console.log('DesktopLayout - Resolving navigation state:', {
      userType,
      isAuthenticated,
      isUsingDevBypass,
      location: location.pathname,
      forceGuestNavigation
    });
    
    const navState = resolveNavigationState(
      userType,
      isAuthenticated,
      userType, // In dev bypass, userType is already the effective type
      isAuthenticated,
      isUsingDevBypass,
      location.pathname,
      forceGuestNavigation
    );
    
    setEffectiveNavState(navState);
  }, [userType, isAuthenticated, isUsingDevBypass, location.pathname, forceGuestNavigation]);

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || forceGuestNavigation;
  const isAdminPage = location.pathname.startsWith('/admin');

  const getContentPadding = () => {
    if (isLandingPage) {
      return 'pt-16 pb-0 px-0';
    } else {
      return 'pt-20 pb-6 px-4';
    }
  };

  const renderNavigation = () => {
    switch (effectiveNavState.navigationType) {
      case NavigationType.ADMIN:
        return <AdminTopNavigation />;
      case NavigationType.USER:
        return <UserTopNavigation activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
      case NavigationType.GUEST:
      default:
        return <GuestTopNavigation />;
    }
  };

  // Refined shouldShowBreadcrumbs logic
  const shouldShowBreadcrumbs = () => {
    // List of paths where breadcrumbs should not be shown
    const excludedPaths = [
      '/', 
      '/landing', 
      '/login', 
      '/signup', 
      '/mission', 
      '/map', 
      '/explore'
    ];
    
    // Don't show breadcrumbs on excluded paths
    if (excludedPaths.includes(location.pathname)) {
      return false;
    }
    
    // Don't show on landing page or admin login page
    if (isLandingPage || location.pathname === '/admin/login') {
      return false;
    }
    
    return true;
  };

  // Render the appropriate footer based on the page type
  const renderFooter = () => {
    if (isAdminPage || effectiveNavState.userType === 'admin') {
      return <AdminFooter />;
    }
    return <AppFooter />;
  };

  // Debug navigation state - remove in production
  useEffect(() => {
    console.log('DesktopLayout - Current navigation state:', {
      path: location.pathname,
      effectiveNavState,
      isUsingDevBypass
    });
  }, [location.pathname, effectiveNavState, isUsingDevBypass]);

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
