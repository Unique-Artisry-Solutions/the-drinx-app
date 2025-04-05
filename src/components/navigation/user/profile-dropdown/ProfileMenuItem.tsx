
import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LucideIcon } from 'lucide-react';
import { profileDropdownStyles } from './profileDropdownStyles';

interface ProfileMenuItemProps {
  to: string;
  icon?: LucideIcon;
  isDarkTheme: boolean;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ 
  to, 
  icon: Icon, 
  isDarkTheme, 
  isActive,
  onClick,
  children 
}) => {
  const itemContent = (
    <>
      {Icon && <Icon className={profileDropdownStyles.menuItemIcon(isDarkTheme)} />}
      <span className={isActive ? "text-spiritless-pink" : ""}>{children}</span>
    </>
  );

  const itemClasses = profileDropdownStyles.menuItem(isDarkTheme, isActive);

  // If onClick is provided, render a button instead of a Link
  if (onClick) {
    return (
      <DropdownMenuItem className={itemClasses} onClick={onClick} asChild={false}>
        {itemContent}
      </DropdownMenuItem>
    );
  }

  // Otherwise render a Link
  return (
    <DropdownMenuItem asChild>
      <Link to={to} className={itemClasses}>
        {itemContent}
      </Link>
    </DropdownMenuItem>
  );
};

export default ProfileMenuItem;
