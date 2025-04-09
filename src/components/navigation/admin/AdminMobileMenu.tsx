
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminNavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

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
    <div className="admin-mobile-menu md:hidden fixed top-14 inset-x-0 z-50">
      <div className="bg-material-primary border-t border-white/10 text-white py-3 px-4 shadow-lg">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="text-sm font-medium">{username}</div>
        </div>
        
        <nav className="space-y-1">
          {navItems.filter(item => item.showInNav !== false).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={onItemClick}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-2 mt-2 border-t border-white/10">
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="w-full justify-start text-red-300 hover:bg-white/10 hover:text-red-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminMobileMenu;
