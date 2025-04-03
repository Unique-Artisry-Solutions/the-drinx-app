
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Route, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserMobileMenuProps {
  isOpen: boolean;
  username: string | null;
  userType: 'individual' | 'establishment';
  onClose: () => void;
}

const UserMobileMenu: React.FC<UserMobileMenuProps> = ({ 
  isOpen, 
  username, 
  userType, 
  onClose 
}) => {
  const location = useLocation();
  
  if (!isOpen) return null;

  const userNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
  ];
  
  if (userType === 'individual') {
    userNavItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  }

  const getProfilePath = () => {
    if (userType === 'establishment') {
      return '/establishment/profile';
    }
    return '/profile';
  };

  return (
    <div className="user-mobile-menu md:hidden py-3 space-y-1 animate-slide-down">
      {username && (
        <div className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100 mb-2 pb-2 bg-gray-50/50 rounded-md">
          Welcome, <span className="font-medium text-spiritless-pink">{username}</span>
        </div>
      )}
      <div className="grid gap-1 px-2">
        {userNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "user-mobile-link flex items-center px-3 py-2.5 rounded-md transition-all duration-300",
                isActive 
                  ? "bg-spiritless-pink/10 text-spiritless-pink font-medium" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={onClose}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 transition-transform duration-300",
                isActive ? "scale-110" : ""
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          to={getProfilePath()}
          className={cn(
            "user-mobile-link flex items-center px-3 py-2.5 rounded-md transition-all duration-300",
            location.pathname === getProfilePath()
              ? "bg-spiritless-pink/10 text-spiritless-pink font-medium" 
              : "text-gray-600 hover:bg-gray-100"
          )}
          onClick={onClose}
        >
          <User className={cn(
            "mr-3 h-5 w-5 transition-transform duration-300",
            location.pathname === getProfilePath() ? "scale-110" : ""
          )} />
          <span>Profile</span>
        </Link>
        {userType === 'individual' && (
          <Link
            to="/profile/bar-crawls"
            className={cn(
              "user-mobile-link flex items-center px-3 py-2.5 rounded-md transition-all duration-300",
              location.pathname === "/profile/bar-crawls"
                ? "bg-spiritless-pink/10 text-spiritless-pink font-medium" 
                : "text-gray-600 hover:bg-gray-100"
            )}
            onClick={onClose}
          >
            <Route className={cn(
              "mr-3 h-5 w-5 transition-transform duration-300",
              location.pathname === "/profile/bar-crawls" ? "scale-110" : ""
            )} />
            <span>My Bar Crawls</span>
          </Link>
        )}
        <Link
          to="/settings"
          className={cn(
            "user-mobile-link flex items-center px-3 py-2.5 rounded-md transition-all duration-300",
            location.pathname === "/settings"
              ? "bg-spiritless-pink/10 text-spiritless-pink font-medium" 
              : "text-gray-600 hover:bg-gray-100"
          )}
          onClick={onClose}
        >
          <Settings className={cn(
            "mr-3 h-5 w-5 transition-transform duration-300",
            location.pathname === "/settings" ? "scale-110" : ""
          )} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default UserMobileMenu;
