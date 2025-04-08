
import React from 'react';
import { useLocation } from 'react-router-dom';
import { AdminProfileDropdown } from './AdminProfileDropdown';
import AdminNavItems from './AdminNavItems';
import { MobileMenu } from '@/components/ui/dropdown/dropdown-base';
import { AdminMobileMenu } from './AdminMobileMenu';

const AdminTopNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="border-b bg-card">
      <div className="flex h-16 items-center px-4 container max-w-7xl mx-auto">
        <div className="md:hidden">
          <MobileMenu>
            <AdminMobileMenu />
          </MobileMenu>
        </div>
        <div className="px-4 font-bold text-lg hidden md:block">
          Admin Portal
        </div>
        <div className="hidden md:flex ml-6 space-x-4 flex-1">
          <AdminNavItems currentPath={location.pathname} />
        </div>
        <div className="ml-auto flex items-center">
          <AdminProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default AdminTopNav;
