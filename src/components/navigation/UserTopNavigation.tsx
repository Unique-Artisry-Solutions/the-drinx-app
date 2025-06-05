
import React from 'react';
import UserNavbar from './user/UserNavbar';

interface TabOption {
  value: string;
  label: string;
}

interface UserTopNavigationProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

export const UserTopNavigation: React.FC<UserTopNavigationProps> = ({
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  return <UserNavbar activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
};

// Keep default export for backward compatibility during transition
export default UserTopNavigation;
