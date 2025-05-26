
import React from 'react';
import ResponsiveLayout from './layout/ResponsiveLayout';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import DevRoleSwitcher from './development/DevRoleSwitcher';

interface TabOption {
  value: string;
  label: string;
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { isDevelopment } = useDevelopmentMode();
  
  return (
    <>
      <ResponsiveLayout {...props} />
      {isDevelopment && <DevRoleSwitcher />}
    </>
  );
};

export default Layout;
