
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
  onLogout?: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  onLogout = () => console.warn('No logout handler provided')
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (!path || !location?.pathname) return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  // Safely find active navigation item with fallbacks
  const safeNavItems = adminNavItems ?? [];
  const activeNavItem = safeNavItems.find(item => 
    item?.path && (isActive(item.path) || location?.pathname?.startsWith(item.path))
  ) ?? safeNavItems[0] ?? { 
    path: '/admin', 
    label: 'Admin', 
    icon: null,
    showInNav: true 
  };
  
  // Filter items safely
  const visibleNavItems = safeNavItems.filter(item => 
    item?.showInNav !== false && item?.path
  );

  if (!visibleNavItems.length) {
    return (
      <nav className="flex-1">
        <div className="flex space-x-2 items-center">
          <span className="text-white/70 text-sm">No navigation items available</span>
        </div>
      </nav>
    );
  }
  
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
              {activeNavItem?.icon && (
                <activeNavItem.icon size={16} className="mr-1" />
              )}
              <span className="text-sm">{activeNavItem?.label ?? 'Navigation'}</span>
              <ChevronDown size={14} className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white z-50">
            {visibleNavItems.map((item) => (
              <DropdownMenuItem key={item.path ?? item.label} asChild>
                <Link
                  to={item.path ?? '/admin'}
                  className={`flex items-center px-2 py-1 w-full ${
                    isActive(item.path ?? '') ? 'bg-gray-100' : ''
                  }`}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span className="text-sm font-medium">{item.label ?? 'Untitled'}</span>
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
