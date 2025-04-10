
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profileDropdownStyles } from './profileDropdownStyles';

interface ProfileMenuItemProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isDarkTheme: boolean;
  isActive?: boolean;
  onClick?: () => void;
  customColor?: string;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ 
  to, 
  icon: Icon, 
  children, 
  isDarkTheme,
  isActive,
  onClick,
  customColor
}) => {
  const content = (
    <>
      <Icon className={cn(
        profileDropdownStyles.menuItemIcon(isDarkTheme, isActive),
        customColor
      )} />
      <span className={cn(customColor)}>{children}</span>
    </>
  );

  return (
    <li className="group">
      {onClick ? (
        <button 
          onClick={onClick} 
          className={profileDropdownStyles.menuItem(isDarkTheme, isActive)}
        >
          {content}
        </button>
      ) : (
        <Link 
          to={to} 
          className={profileDropdownStyles.menuItem(isDarkTheme, isActive)}
        >
          {content}
        </Link>
      )}
    </li>
  );
};

export default ProfileMenuItem;
