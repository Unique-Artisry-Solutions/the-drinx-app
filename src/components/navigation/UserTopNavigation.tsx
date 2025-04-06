
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

const UserTopNavigation: React.FC<UserTopNavigationProps> = ({
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  return <UserNavbar activeTab={activeTab} handleTabChange={handleTabChange} tabOptions={tabOptions} />;
};

export default UserTopNavigation;
