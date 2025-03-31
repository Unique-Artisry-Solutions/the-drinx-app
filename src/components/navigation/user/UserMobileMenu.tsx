
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Route, User } from 'lucide-react';

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
  } else {
    userNavItems.push({ icon: Route, label: 'Add', path: '/add' });
  }

  const getProfilePath = () => {
    if (userType === 'establishment') {
      return '/establishment/profile';
    }
    return '/profile';
  };

  return (
    <div className="user-mobile-menu md:hidden py-3 space-y-2">
      {username && (
        <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100 mb-2 pb-2">
          Welcome, <span className="font-medium text-spiritless-pink">{username}</span>
        </div>
      )}
      {userNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`user-mobile-link block px-3 py-2 rounded-md ${
              isActive ? 'bg-material-primary/10 text-material-primary' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={onClose}
          >
            <div className="flex items-center">
              <item.icon className="mr-2 h-5 w-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
      <Link
        to={getProfilePath()}
        className="user-mobile-link block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
        onClick={onClose}
      >
        <div className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          <span>Profile</span>
        </div>
      </Link>
    </div>
  );
};

export default UserMobileMenu;
