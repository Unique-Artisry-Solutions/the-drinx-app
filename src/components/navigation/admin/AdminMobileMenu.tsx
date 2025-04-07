
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { AdminNavItem } from './AdminNavItems';
import { Separator } from '@/components/ui/separator';

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
    <div className="admin-mobile-menu md:hidden py-3 space-y-1 animate-fade-in bg-material-primary/95 backdrop-blur-sm border-t border-white/10">
      <div className="text-sm text-white/90 px-3 py-2 border-b border-white/10 mb-2">
        <span className="font-medium text-white">Admin: {username}</span>
      </div>
      
      {navItems.filter(item => item.showInNav !== false).map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="admin-mobile-link flex items-center px-3 py-2 hover:bg-white/10 transition-colors"
          onClick={onItemClick}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span className="text-sm">{item.label}</span>
        </Link>
      ))}
      
      <Separator className="my-2 bg-white/10" />
      
      <button
        className="flex items-center w-full px-3 py-2 text-red-200 hover:bg-red-800/30 transition-colors"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span className="text-sm">Logout</span>
      </button>
    </div>
  );
};

export default AdminMobileMenu;
