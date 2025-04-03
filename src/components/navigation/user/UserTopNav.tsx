
import React from 'react';
import UserNavbar from './UserNavbar';

interface TabOption {
  value: string;
  label: string;
}

interface UserTopNavProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserTopNav: React.FC<UserTopNavProps> = ({ 
  activeTab, 
  handleTabChange, 
  tabOptions 
}) => {
  return (
    <UserNavbar 
      activeTab={activeTab} 
      handleTabChange={handleTabChange}
      tabOptions={tabOptions} 
    />
  );
};

export default UserTopNav;
