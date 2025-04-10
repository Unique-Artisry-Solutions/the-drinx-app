
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { profileDropdownStyles } from './profileDropdownStyles';

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
  icon: Icon,
  children,
  isDarkTheme,
  isActive = false,
  onClick,
  customColor
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  const iconClass = customColor && isActive 
    ? customColor 
    : '';
  
  const content = (
    <div className={profileDropdownStyles.menuItem(isDarkTheme, isActive, customColor)}>
      <Icon 
        className={`mr-2 h-4 w-4 ${iconClass}`} 
      />
      <span>{children}</span>
    </div>
  );
  
  return to === "#" ? (
    <button 
      type="button" 
      className="w-full text-left"
      onClick={handleClick}
    >
      {content}
    </button>
  ) : (
    <Link 
      to={to}
      onClick={handleClick}
    >
      {content}
    </Link>
  );
};

export default ProfileMenuItem;
