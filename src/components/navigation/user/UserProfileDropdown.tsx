
import React from 'react';
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from '@/contexts/ThemeContext';
import ProfileDropdownButton from './profile-dropdown/ProfileDropdownButton';
import ProfileContent from './profile-dropdown/ProfileContent';

interface TabOption {
  value: string;
  label: string;
}

interface UserProfileDropdownProps {
  username: string | null;
  userType: 'individual' | 'establishment';
  handleLogout: () => Promise<void>;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  username,
  userType,
  handleLogout,
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ProfileDropdownButton isDarkTheme={isDarkTheme} />
      </DropdownMenuTrigger>
      
      <ProfileContent 
        username={username}
        userType={userType}
        isDarkTheme={isDarkTheme}
        handleLogout={handleLogout}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        tabOptions={tabOptions}
      />
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
