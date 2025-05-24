
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface UserNavLinksProps {
  userType: 'individual' | 'establishment' | 'promoter';
}

const UserNavLinks: React.FC<UserNavLinksProps> = ({ userType }) => {
  const location = useLocation();
  const { theme } = useTheme();

  const getNavItems = () => {
    switch (userType) {
      case 'establishment':
        return [
          { label: 'Dashboard', path: '/establishment/dashboard' },
          { label: 'Events', path: '/establishment/events' },
          { label: 'Analytics', path: '/establishment/analytics' },
          { label: 'Profile', path: '/establishment/profile' }
        ];
      case 'promoter':
        return [
          { label: 'Dashboard', path: '/promoter/dashboard' },
          { label: 'Events', path: '/promoter/events' },
          { label: 'Analytics', path: '/promoter/analytics' },
          { label: 'Profile', path: '/promoter/profile' }
        ];
      case 'individual':
      default:
        return [
          { label: 'Explore', path: '/explore' },
          { label: 'Map', path: '/map' },
          { label: 'Profile', path: '/profile' }
        ];
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "text-sm font-medium transition-colors hover:text-primary";
    const activeClasses = userType === 'promoter' 
      ? "text-purple-600" 
      : userType === 'establishment'
        ? "text-blue-600"
        : "text-spiritless-pink";
    const inactiveClasses = theme === 'dark' 
      ? "text-gray-300 hover:text-white" 
      : "text-gray-600 hover:text-gray-900";
    
    return cn(
      baseClasses,
      isActive(path) ? activeClasses : inactiveClasses
    );
  };

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={getLinkClassName(item.path)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default UserNavLinks;
