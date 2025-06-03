
import React from 'react';
import { BaseComponentProps, StandardNavigationProps } from '@/components/shared/types';

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
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Navigation would go here */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
