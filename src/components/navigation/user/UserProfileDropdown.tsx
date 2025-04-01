
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Route } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface UserProfileDropdownProps {
  username: string | null;
  userType: 'individual' | 'establishment';
  handleLogout: () => Promise<void>;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  username, 
  userType, 
  handleLogout 
}) => {
  const getProfilePath = () => {
    if (userType === 'establishment') {
      return '/establishment/profile';
    }
    return '/profile';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="user-profile-button">
          <User size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="user-profile-dropdown">
        {username && (
          <>
            <div className="px-2 py-1.5 text-sm font-medium text-gray-500">
              Signed in as <span className="text-spiritless-pink">{username}</span>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to={getProfilePath()} className="user-profile-item flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {userType === 'individual' && (
          <DropdownMenuItem asChild>
            <Link to="/profile/bar-crawls" className="user-profile-item flex items-center gap-2 cursor-pointer">
              <Route className="h-4 w-4" />
              <span>My Bar Crawls</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/settings" className="user-profile-item flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="user-profile-item flex items-center gap-2 text-red-600 cursor-pointer" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
