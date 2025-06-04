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

interface DesktopLayoutProps extends BaseComponentProps, StandardNavigationProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
  forceGuestNavigation?: boolean;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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

  // Determine whether to force guest navigation
  const shouldForceGuestNav = forceGuestNavigation || (isDevelopment && isDevModeActive && !userType);

  return (
    <div className={`flex flex-col h-screen ${className || ''}`} data-testid={testId}>
      <TopNavigation
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        tabOptions={tabOptions}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container max-w-6xl mx-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DesktopLayout;
