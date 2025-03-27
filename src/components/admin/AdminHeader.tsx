
import React from 'react';
import { Button } from '@/components/ui/button';
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
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>
    </header>
  );
};

export default AdminHeader;
