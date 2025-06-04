import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import TopNavigation from '@/components/navigation/TopNavigation';
import { toUserType } from '@/utils/userTypeGuards';
import { BaseComponentProps, StandardNavigationProps } from '@/components/shared/types';

interface TabOption {
  value: string;
  label: string;
}

interface MobileLayoutProps extends BaseComponentProps, StandardNavigationProps {
  children: React.ReactNode;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  activeTab,
  handleTabChange,
  tabOptions,
  forceGuestNavigation = false,
  className,
  'data-testid': testId
}) => {
  const { userType: rawUserType } = useAuth();
  const { isDevelopment, isDevModeActive } = useDevelopmentMode();
  
  // Safely convert userType to UserType using utility function
  const userType = toUserType(rawUserType);
  
  // Determine effective user type
  const effectiveUserType = isDevelopment && isDevModeActive ? rawUserType : userType;

  return (
    <div className={`mobile-layout flex flex-col min-h-screen ${className || ''}`} data-testid={testId}>
      <header className="sticky top-0 z-40 bg-white/95 border-b shadow-sm">
        <TopNavigation 
          activeTab={activeTab} 
          handleTabChange={handleTabChange}
          tabOptions={tabOptions}
        />
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Spiritless. All rights reserved.
      </footer>
    </div>
  );
};

export default MobileLayout;
