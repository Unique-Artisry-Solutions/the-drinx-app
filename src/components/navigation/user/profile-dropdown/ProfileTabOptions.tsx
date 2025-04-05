
import React from 'react';
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { profileDropdownStyles } from './profileDropdownStyles';

interface TabOption {
  value: string;
  label: string;
}

interface ProfileTabOptionsProps {
  tabOptions: TabOption[];
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  isDarkTheme: boolean;
}

const ProfileTabOptions: React.FC<ProfileTabOptionsProps> = ({
  tabOptions,
  activeTab,
  handleTabChange,
  isDarkTheme
}) => {
  if (!tabOptions || tabOptions.length === 0) return null;

  const handleTabClick = (tabValue: string) => {
    if (handleTabChange) {
      handleTabChange(tabValue);
    }
  };

  return (
    <DropdownMenuGroup className={profileDropdownStyles.tabOptionsContainer(isDarkTheme)}>
      <DropdownMenuLabel className={profileDropdownStyles.tabOptionsLabel(isDarkTheme)}>
        Profile Sections
      </DropdownMenuLabel>
      
      {tabOptions.map(tab => (
        <DropdownMenuItem 
          key={tab.value} 
          className={profileDropdownStyles.menuItem(isDarkTheme, activeTab === tab.value)} 
          onClick={() => handleTabClick(tab.value)}
        >
          <span className="pl-2">{tab.label}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
};

export default ProfileTabOptions;
