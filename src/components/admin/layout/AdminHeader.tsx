
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { getAdminUsername, clearAdminAuthentication } from '@/utils/adminAuth';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const adminUsername = getAdminUsername() || 'Admin';

  const handleLogout = () => {
    console.log('Admin logging out');
    clearAdminAuthentication();
    navigate('/admin');
  };

  return (
    <header className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User size={18} />
          <span>{adminUsername}</span>
        </div>
        
        <Button 
          variant="ghost" 
          className="hover:bg-primary-foreground/10 text-primary-foreground"
          onClick={handleLogout}
          size="sm"
        >
          <LogOut size={18} className="mr-2" /> Sign Out
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
