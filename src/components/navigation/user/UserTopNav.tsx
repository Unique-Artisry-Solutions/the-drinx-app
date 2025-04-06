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
  // We'll keep this a simple passthrough component that just renders UserNavbar
  // The actual consolidation of navigation will happen in the UserNavbar component
  return (
    <UserNavbar 
      activeTab={activeTab} 
      handleTabChange={handleTabChange}
      tabOptions={tabOptions} 
    />
  );
};

export default UserTopNav;
