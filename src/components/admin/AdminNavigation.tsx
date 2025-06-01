
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronDown } from 'lucide-react';
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
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  // Find the active navigation item (if any)
  const activeNavItem = adminNavItems.find(item => 
    isActive(item.path) || location.pathname.startsWith(item.path)
  ) || adminNavItems[0];
  
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
              {activeNavItem && activeNavItem.icon && (
                <>
                  <activeNavItem.icon size={16} className="mr-1" />
                  <span className="text-sm">{activeNavItem.label}</span>
                </>
              )}
              <ChevronDown size={14} className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white z-50">
            {adminNavItems.filter(item => item.showInNav !== false).map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link
                  to={item.path}
                  className={`flex items-center px-2 py-1 w-full ${
                    isActive(item.path) ? 'bg-gray-100' : ''
                  }`}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
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
