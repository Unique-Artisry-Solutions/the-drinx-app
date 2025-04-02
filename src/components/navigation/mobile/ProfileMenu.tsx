
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
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        {profileItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-md",
                isActive 
                  ? "bg-material-primary/10 text-material-primary" 
                  : "text-material-on-surface-variant hover:bg-gray-100"
              )}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMenu;
