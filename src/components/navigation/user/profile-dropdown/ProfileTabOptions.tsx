
import React from 'react';
import { cn } from '@/lib/utils';
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
    <DropdownMenuGroup className={cn(
      "px-1 py-1 mt-1",
      isDarkTheme ? "border-t border-gray-700" : "border-t border-gray-200"
    )}>
      <DropdownMenuLabel className={cn(
        "px-3 py-1 text-xs font-medium",
        isDarkTheme ? "text-gray-400" : "text-gray-700"
      )}>
        Profile Sections
      </DropdownMenuLabel>
      
      {tabOptions.map(tab => (
        <DropdownMenuItem 
          key={tab.value} 
          className={cn(
            "flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
            isDarkTheme 
              ? "hover:bg-gray-700/50" 
              : "hover:bg-gray-100",
            activeTab === tab.value 
              ? isDarkTheme 
                ? "bg-gray-700/50 font-medium text-spiritless-pink" 
                : "bg-gray-100 font-medium text-spiritless-pink" 
              : ""
          )} 
          onClick={() => handleTabClick(tab.value)}
        >
          <span className="pl-2">{tab.label}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
};

export default ProfileTabOptions;
