
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import AdminNavigation from './AdminNavigation';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-material-primary text-material-on-primary p-4 shadow-md">
      <div className="container max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium">Admin Dashboard</h1>
          <AdminNavigation onLogout={onLogout} />
        </div>
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="border-white text-white hover:bg-white/20 hover:text-white transition-colors duration-200 flex items-center gap-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
