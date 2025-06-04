
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import UserNavbar from './user/UserNavbar';
import AdminTopNav from './admin/AdminTopNav';

interface TabOption {
  value: string;
  label: string;
}

interface TopNavigationProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const { userType: authUserType } = useAuth();
  const { devMode, isDevModeActive, isDevelopment } = useDevelopmentMode();

  // Determine effective user type
  const effectiveUserType = isDevelopment && isDevModeActive ? devMode : authUserType;

  // Render admin navigation for admin users
  if (effectiveUserType === 'admin') {
    return <AdminTopNav />;
  }

  // Render user navigation for all other user types
  return (
    <UserNavbar 
      activeTab={activeTab} 
      handleTabChange={handleTabChange}
      tabOptions={tabOptions} 
    />
  );
};

export default TopNavigation;
