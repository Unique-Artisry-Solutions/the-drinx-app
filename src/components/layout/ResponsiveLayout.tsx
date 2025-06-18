
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
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  console.log('ResponsiveLayout render:', { isDevelopment, isInitialized, location: location.pathname });
  
  return (
    <div className="w-full min-h-screen">
      {isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      {isDevelopment && isInitialized && (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-auto">
          <DevRoleSwitcher />
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
