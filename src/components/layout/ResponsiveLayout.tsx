
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import DevRoleSwitcher from '@/components/development/DevRoleSwitcher';
import { useDevelopmentMode } from '@/hooks/useDevelopmentMode';

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
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Log comprehensive state for debugging
  useEffect(() => {
    console.log('ResponsiveLayout - Route navigation flow:', {
      pathname: location.pathname,
      isDevelopment,
      isInitialized,
      isDevModeActive,
      devMode,
      isMobile,
      timestamp: new Date().toISOString()
    });
  }, [location.pathname, isDevelopment, isInitialized, isDevModeActive, devMode, isMobile]);
  
  console.log('ResponsiveLayout rendering DevRoleSwitcher with development state:', {
    isDevelopment,
    isInitialized
  });
  
  return (
    <>
      {isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      <DevRoleSwitcher />
    </>
  );
};

export default ResponsiveLayout;
