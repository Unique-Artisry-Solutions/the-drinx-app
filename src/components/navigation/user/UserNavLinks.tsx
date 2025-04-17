
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Route, Megaphone, BarChart2, Building, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserNavLinksProps {
  userType: 'individual' | 'establishment' | 'promoter';
}

const UserNavLinks: React.FC<UserNavLinksProps> = ({ userType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getHomePath = () => {
    if (userType === 'establishment') {
      return '/establishment/dashboard';
    } else if (userType === 'promoter') {
      return '/promoter/dashboard';
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
    { icon: Route, label: 'Circuits', path: '/swig-circuits' },
  ];
  
  // Add different items based on user type - removed Create for individual users
  if (userType === 'promoter') {
    userNavItems.push({ icon: Route, label: 'Create', path: '/create-swig-circuit' });
    userNavItems.push({ icon: Building, label: 'Venues', path: '/explore' });
    userNavItems.push({ icon: Megaphone, label: 'Promotions', path: '/promoter/dashboard' });
    userNavItems.push({ icon: BarChart2, label: 'Analytics', path: '/promoter/analytics' });
  } else if (userType === 'establishment') {
    userNavItems.push({ icon: MessageSquare, label: 'Messages', path: '/establishment/communication' });
  }

  return (
    <div className="user-nav-links hidden md:flex space-x-1">
      {userNavItems.map((item) => {
        const isActive = location.pathname === item.path ||
          (item.path === '/establishment/dashboard' && location.pathname.startsWith('/establishment/')) ||
          (item.path === '/promoter/dashboard' && location.pathname.startsWith('/promoter/')) ||
          (item.path === '/swig-circuits' && location.pathname.startsWith('/swig-circuits/'));
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={item.onClick}
            className={cn(
              "user-nav-link flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300",
              userType === 'promoter' 
                ? (isActive 
                    ? "bg-purple-100 text-purple-600 font-medium shadow-sm" 
                    : "text-foreground/80 hover:text-purple-600 hover:bg-purple-50")
                : (isActive 
                    ? "bg-spiritless-pink/15 text-spiritless-pink font-medium shadow-sm" 
                    : "text-foreground/80 hover:text-spiritless-pink hover:bg-background/80")
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className={cn(
              "h-4 w-4 transition-transform duration-300",
              isActive ? "scale-110" : ""
            )} />
            <span className={cn(
              "text-sm font-medium",
              userType === 'promoter'
                ? (isActive ? "text-purple-600" : "")
                : (isActive ? "text-spiritless-pink" : "")
            )}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default UserNavLinks;
