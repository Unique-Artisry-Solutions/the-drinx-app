
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';

interface AdminNavigationProps {
  onLogout: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  onLogout
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="flex-1">
      <ul className="flex space-x-2">
        {adminNavItems.filter(item => item.showInNav).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded-md flex items-center transition-colors ${
              isActive(item.path) ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
        
        <Button 
          variant="outline" 
          size="sm"
          className="border-white text-white hover:text-white hover:bg-spiritless-burgundy/25 ml-2"
          onClick={onLogout}
        >
          <LogOut size={16} className="mr-1" />
          <span className="text-sm">Logout</span>
        </Button>
      </ul>
    </nav>
  );
};

export default AdminNavigation;
