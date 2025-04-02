
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
        "flex flex-col items-center justify-center w-full h-full py-2 transition-all duration-300",
        isActive 
          ? "text-spiritless-pink" 
          : "text-gray-500 hover:text-gray-700"
      )}
    >
      <div className={cn(
        "flex items-center justify-center mb-1 relative",
        isActive && (
          "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 " +
          "after:w-1.5 after:h-1.5 after:bg-spiritless-pink after:rounded-full after:animate-pulse"
        )
      )}>
        <item.icon size={22} className={cn(
          "transition-transform duration-300",
          isActive ? "scale-110" : "scale-100"
        )} />
      </div>
      <span className={cn(
        "text-xs font-medium transition-all duration-300",
        isActive ? "opacity-100" : "opacity-80"
      )}>
        {item.label}
      </span>
    </Link>
  );
};

export default NavItem;
