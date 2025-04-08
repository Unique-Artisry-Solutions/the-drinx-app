
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Route } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserNavLinksProps {
  userType: 'individual' | 'establishment';
}

const UserNavLinks: React.FC<UserNavLinksProps> = ({ userType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getHomePath = () => {
    if (userType === 'establishment') {
      return '/establishment/dashboard';
    } else {
      return '/explore';
    }
  };
  
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(getHomePath());
  };
  
  const userNavItems = [
    { icon: Home, label: 'Home', path: getHomePath(), onClick: handleHomeClick },
    { icon: Map, label: 'Map', path: '/map' },
  ];
  
  // Only add the "Create" button for individual users, no "Add" button for establishment users
  if (userType === 'individual') {
    userNavItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  }

  return (
    <div className="user-nav-links hidden md:flex space-x-1">
      {userNavItems.map((item) => {
        const isActive = location.pathname === item.path ||
          (item.path === '/establishment/dashboard' && location.pathname.startsWith('/establishment/'));
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={item.onClick}
            className={cn(
              "user-nav-link flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300",
              isActive 
                ? "bg-spiritless-pink/15 text-spiritless-pink font-medium shadow-sm" 
                : "text-foreground/80 hover:text-spiritless-pink hover:bg-background/80"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className={cn(
              "h-4 w-4 transition-transform duration-300",
              isActive ? "scale-110" : ""
            )} />
            <span className={cn(
              "text-sm font-medium",
              isActive ? "text-spiritless-pink" : ""
            )}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default UserNavLinks;
