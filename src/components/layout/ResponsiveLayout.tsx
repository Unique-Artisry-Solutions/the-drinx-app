
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import DevRoleSwitcher from '@/components/development/DevRoleSwitcher';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

interface TabOption {
  value: string;
  label: string;
}

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (props) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isDevelopment, isInitialized, isDevModeActive, devMode } = useDevelopmentMode();
  
  // Check if we're in admin context
  const isAdminContext = location.pathname.startsWith('/admin');
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Enhanced logging for admin context
  useEffect(() => {
    console.log('ResponsiveLayout - Route navigation flow:', {
      pathname: location.pathname,
      isDevelopment,
      isInitialized,
      isDevModeActive,
      devMode,
      isMobile,
      isAdminContext,
      timestamp: new Date().toISOString()
    });

    // Additional admin-specific logging
    if (isAdminContext) {
      console.log('ResponsiveLayout - Admin context detected:', {
        shouldShowDevSwitcher: isDevelopment && isInitialized,
        adminPath: location.pathname,
        devSwitcherConditions: {
          isDevelopment,
          isInitialized
        }
      });
    }
  }, [location.pathname, isDevelopment, isInitialized, isDevModeActive, devMode, isMobile, isAdminContext]);
  
  console.log('ResponsiveLayout rendering DevRoleSwitcher with development state:', {
    isDevelopment,
    isInitialized,
    isAdminContext,
    willRender: isDevelopment && isInitialized
  });
  
  return (
    <>
      {isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      {/* Always render DevRoleSwitcher if in development, regardless of admin context */}
      {isDevelopment && isInitialized && <DevRoleSwitcher />}
    </>
  );
};

export default ResponsiveLayout;
