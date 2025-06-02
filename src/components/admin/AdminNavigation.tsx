
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminNavigationProps {
  onLogout: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ onLogout }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/settings', label: 'Settings' },
  ];
  
  return (
    <nav className="flex items-center space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === item.path
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {item.label}
        </Link>
      ))}
      <Button variant="outline" size="sm" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
};

export default AdminNavigation;
