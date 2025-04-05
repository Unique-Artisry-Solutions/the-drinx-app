import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LucideIcon } from 'lucide-react';

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
      {Icon && <Icon className={isDarkTheme ? "h-4 w-4 text-gray-400" : "h-4 w-4 text-gray-700"} />}
      <span className={isActive ? "text-spiritless-pink" : ""}>{children}</span>
    </>
  );

  const itemClasses = cn(
    "user-profile-item flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
    isDarkTheme 
      ? "hover:bg-gray-700/50 text-gray-200" 
      : "hover:bg-gray-100 text-gray-700",
    isActive 
      ? isDarkTheme 
        ? "bg-gray-700/50 font-medium text-spiritless-pink" 
        : "bg-gray-100 font-medium text-spiritless-pink" 
      : ""
  );

  // If onClick is provided, render a button instead of a Link
  if (onClick) {
    return (
      <DropdownMenuItem className={itemClasses} onClick={onClick}>
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
