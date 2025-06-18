
import React from 'react';
import { Outlet } from 'react-router-dom';
import ResponsiveLayout from './layout/ResponsiveLayout';
import { BaseComponentProps, StandardNavigationProps } from '@/components/shared/types';

interface TabOption {
  value: string;
  label: string;
}

// Extend with standard props
interface LayoutProps extends BaseComponentProps, StandardNavigationProps {
  forceGuestNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <ResponsiveLayout {...props}>
      <Outlet />
    </ResponsiveLayout>
  );
};

// Keep default export for backward compatibility during transition
export default Layout;
