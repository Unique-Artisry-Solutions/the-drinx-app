
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Route } from 'lucide-react';

interface UserNavLinksProps {
  userType: 'individual' | 'establishment';
}

const UserNavLinks: React.FC<UserNavLinksProps> = ({ userType }) => {
  const location = useLocation();
  
  const userNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
  ];
  
  if (userType === 'individual') {
    userNavItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  } else {
    userNavItems.push({ icon: Route, label: 'Add', path: '/add' });
  }

  return (
    <div className="user-nav-links hidden md:flex space-x-1">
      {userNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`user-nav-link px-3 py-2 rounded-md flex items-center ${
              isActive ? 'bg-material-primary/10 text-material-primary' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default UserNavLinks;
