
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

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
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  if (isMobile) {
    return <MobileLayout {...props} />;
  }
  
  return <DesktopLayout {...props} />;
};

export default ResponsiveLayout;
