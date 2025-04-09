
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear admin auth data
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_session_created');
    localStorage.removeItem('admin_bypass');
    localStorage.removeItem('bypass_user_id');
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_username');
    
    // Call the provided onLogout prop
    onLogout();
    
    // Force a complete page reload and navigation to landing page
    window.location.href = '/landing';
  };
  
  return (
    <header className="bg-material-primary text-material-on-primary p-4 shadow-md">
      <div className="container max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium">Admin Dashboard</h1>
          <AdminNavigation onLogout={handleLogout} />
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="border-white text-white hover:text-white transition-colors duration-200 flex items-center gap-2 bg-spiritless-burgundy"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
