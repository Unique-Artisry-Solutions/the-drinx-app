
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { AdminNavItem } from './AdminNavItems';

interface AdminMobileMenuProps {
  isOpen: boolean;
  username: string;
  navItems: AdminNavItem[];
  onItemClick: () => void;
  onLogout: () => void;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({
  isOpen,
  username,
  navItems,
  onItemClick,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-mobile-menu md:hidden py-3 space-y-2 animate-fade-in">
      <div className="text-sm text-white/80 px-3 py-2">
        Welcome, <span className="font-medium text-white">{username}</span>
      </div>
      
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="admin-mobile-link block px-3 py-2 rounded-md hover:bg-white/10"
          onClick={onItemClick}
        >
          <div className="flex items-center">
            <item.icon className="mr-2 h-5 w-5" />
            <span>{item.label}</span>
          </div>
        </Link>
      ))}
      
      <button
        className="flex items-center w-full px-3 py-2 text-red-200 hover:bg-red-800/30 rounded-md"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminMobileMenu;
