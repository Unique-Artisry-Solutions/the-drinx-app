
import React from 'react';
import UnifiedNavItem from '../../UnifiedNavItem';
import { profileDropdownStyles } from './profileDropdownStyles';
import { LucideIcon } from 'lucide-react';

interface ProfileMenuItemProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isDarkTheme: boolean;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  customColor?: string;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  to,
  icon: IconComponent,
  children,
  isDarkTheme,
  isActive = false,
  onClick,
  customColor
}) => {
  // Use the UnifiedNavItem component with a custom renderer for profile dropdown
  const content = (
    <div className={profileDropdownStyles.menuItem(isDarkTheme, isActive, customColor)}>
      <IconComponent 
        className={`mr-2 h-4 w-4 ${customColor && isActive ? customColor : ''}`} 
      />
      <span>{children}</span>
    </div>
  );
  
  if (to === "#") {
    return (
      <button 
        type="button" 
        className="w-full text-left"
        onClick={onClick}
      >
        {content}
      </button>
    );
  }
  
  return (
    <UnifiedNavItem
      path={to}
      icon={IconComponent}
      label={children as string}
      isActive={isActive}
      onClick={onClick}
      variant="sidebar"
    />
  );
};

export default ProfileMenuItem;
