
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdminProfileDropdownProps {
  username: string;
  onLogout: () => void;
}

const AdminProfileDropdown: React.FC<AdminProfileDropdownProps> = ({
  username,
  onLogout
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Call the provided logout function
    onLogout();
    
    // Ensure we navigate to landing page
    setTimeout(() => {
      navigate('/landing');
    }, 100);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="admin-profile-button border-white text-white transition-colors duration-200 bg-spiritless-burgundy">
          <User size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="admin-profile-dropdown w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground md:hidden">
          Welcome, {username}
        </div>
        <DropdownMenuSeparator className="md:hidden" />
        <DropdownMenuItem asChild>
          <Link to="/admin/dashboard" className="admin-profile-item flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="admin-profile-item flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="admin-logout-item flex items-center gap-2 text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminProfileDropdown;
