
import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminProfileDropdown from './AdminProfileDropdown';
import AdminNavItems from './AdminNavItems';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown/dropdown-base';
import { DropdownMenuContent } from '@/components/ui/dropdown/dropdown-content';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminMobileMenu } from './AdminMobileMenu';

const AdminTopNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="border-b bg-card">
      <div className="flex h-16 items-center px-4 container max-w-7xl mx-auto">
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <AdminMobileMenu />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="px-4 font-bold text-lg hidden md:block">
          Admin Portal
        </div>
        <div className="hidden md:flex ml-6 space-x-4 flex-1">
          <AdminNavItems currentPath={location.pathname} />
        </div>
        <div className="ml-auto flex items-center">
          <AdminProfileDropdown username="Admin" onLogout={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default AdminTopNav;
