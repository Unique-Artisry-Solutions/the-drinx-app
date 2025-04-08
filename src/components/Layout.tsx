
import React from 'react';
import ResponsiveLayout from './layout/ResponsiveLayout';

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
  return <ResponsiveLayout {...props} />;
};

export default Layout;
