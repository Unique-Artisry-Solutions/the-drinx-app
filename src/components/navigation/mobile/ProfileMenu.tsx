
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItem } from './types';
import { getProfileItems } from './ProfileItems';

interface ProfileMenuProps {
  expanded: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ expanded }) => {
  const location = useLocation();
  const profileItems = getProfileItems();
  
  if (!expanded) return null;
  
  return (
    <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm animate-slide-up transition-all duration-300">
      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        {profileItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-spiritless-pink/10 text-spiritless-pink shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon size={20} className={cn(
                "mb-1 transition-transform duration-300",
                isActive ? "scale-110" : "scale-100"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMenu;
