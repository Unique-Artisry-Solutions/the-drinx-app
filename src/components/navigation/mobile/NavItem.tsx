
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItem as NavItemType } from './types';

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onClick }) => {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full py-2",
        isActive 
          ? "text-material-primary" 
          : "text-material-on-surface-variant"
      )}
    >
      <div className={cn(
        "flex items-center justify-center",
        isActive && "animate-pulse-subtle"
      )}>
        <item.icon size={24} />
      </div>
      <span className="text-xs mt-1">{item.label}</span>
    </Link>
  );
};

export default NavItem;
