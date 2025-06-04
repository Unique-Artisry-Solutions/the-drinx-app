
import React from 'react';
import { BaseComponentProps, StandardNavigationProps } from '@/components/shared/types';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

interface ResponsiveLayoutProps extends BaseComponentProps, StandardNavigationProps {
  children: React.ReactNode;
  forceGuestNavigation?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children,
  forceGuestNavigation = false,
  activeTab,
  handleTabChange,
  tabOptions,
  className = ''
}) => {
  const isMobile = useIsMobile();

  // Use the appropriate layout based on device type
  if (isMobile) {
    return (
      <MobileLayout
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        tabOptions={tabOptions}
        forceGuestNavigation={forceGuestNavigation}
      >
        {children}
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      tabOptions={tabOptions}
      forceGuestNavigation={forceGuestNavigation}
    >
      {children}
    </DesktopLayout>
  );
};
