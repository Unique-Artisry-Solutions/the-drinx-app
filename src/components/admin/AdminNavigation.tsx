
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

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
  
  // Find the active navigation item (if any)
  const activeNavItem = adminNavItems.find(item => isActive(item.path));
  
  return (
    <nav className="flex-1">
      <div className="flex space-x-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white text-white hover:text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Menu size={16} />
              <span className="text-sm">
                {activeNavItem ? activeNavItem.label : 'Navigation'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            {adminNavItems.filter(item => item.showInNav).map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link
                  to={item.path}
                  className={`flex items-center px-2 py-1 w-full ${
                    isActive(item.path) ? 'bg-gray-100' : ''
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center text-red-600 cursor-pointer" 
              onClick={onLogout}
            >
              <LogOut size={16} className="mr-2" />
              <span className="text-sm">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default AdminNavigation;
