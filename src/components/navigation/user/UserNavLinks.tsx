
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Route } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserNavLinksProps {
  userType: 'individual' | 'establishment';
}

const UserNavLinks: React.FC<UserNavLinksProps> = ({ userType }) => {
  const location = useLocation();
  
  const userNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
  ];
  
  // Only add the "Create" button for individual users, no "Add" button for establishment users
  if (userType === 'individual') {
    userNavItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  }

  return (
    <div className="user-nav-links hidden md:flex space-x-1">
      {userNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "user-nav-link flex items-center space-x-1.5 px-3 py-2 rounded-md transition-all duration-300",
              isActive 
                ? "bg-spiritless-pink/10 text-spiritless-pink" 
                : "text-gray-600 hover:text-spiritless-pink hover:bg-gray-50"
            )}
          >
            <item.icon className={cn(
              "h-4 w-4 transition-transform duration-300",
              isActive ? "scale-110" : ""
            )} />
            <span className={cn(
              "font-medium",
              isActive ? "text-spiritless-pink" : ""
            )}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default UserNavLinks;
