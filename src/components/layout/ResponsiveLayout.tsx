
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
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  
  // Check if we're in admin context
  const isAdminContext = location.pathname.startsWith('/admin');
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Enhanced logging for route navigation
  useEffect(() => {
    console.log('ResponsiveLayout - Route navigation:', {
      pathname: location.pathname,
      isDevelopment,
      isInitialized,
      isMobile,
      isAdminContext,
      timestamp: new Date().toISOString()
    });
  }, [location.pathname, isDevelopment, isInitialized, isMobile, isAdminContext]);
  
  return (
    <div className="w-full min-h-screen">
      {isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      {/* Only render DevRoleSwitcher in development mode when initialized */}
      {isDevelopment && isInitialized && (
        <div className="fixed top-4 right-4 z-[9999]">
          <DevRoleSwitcher />
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
