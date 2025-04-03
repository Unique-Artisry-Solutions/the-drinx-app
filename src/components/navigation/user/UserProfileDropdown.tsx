
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Route } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TabOption {
  value: string;
  label: string;
}

interface UserProfileDropdownProps {
  username: string | null;
  userType: 'individual' | 'establishment';
  handleLogout: () => Promise<void>;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  username, 
  userType, 
  handleLogout,
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const location = useLocation();
  const isEstablishmentProfile = location.pathname.includes('/establishment/profile');

  const getProfilePath = () => {
    if (userType === 'establishment') {
      return '/establishment/profile';
    }
    return '/profile';
  };

  const handleTabClick = (tabValue: string) => {
    if (handleTabChange) {
      handleTabChange(tabValue);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="user-profile-button h-9 w-9 rounded-full border-gray-200 bg-white hover:bg-gray-50 hover:text-spiritless-pink transition-all duration-300"
        >
          <User 
            size={18} 
            className="transition-transform duration-300 hover:scale-110" 
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="user-profile-dropdown w-56 bg-white/95 backdrop-blur-sm border border-gray-100 shadow-md rounded-lg p-1 animate-fade-in"
      >
        {username && (
          <>
            <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b border-gray-100 mb-1">
              Signed in as <span className="text-spiritless-pink">{username}</span>
            </div>
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link 
            to={getProfilePath()} 
            className={cn(
              "user-profile-item flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm",
              "hover:bg-gray-50 transition-colors duration-200"
            )}
          >
            <User className="h-4 w-4 text-gray-500" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Establishment Profile Tabs */}
        {isEstablishmentProfile && tabOptions && tabOptions.length > 0 && (
          <DropdownMenuGroup className="px-1 py-1 mt-1 border-t border-gray-100">
            <DropdownMenuLabel className="px-3 py-1 text-xs font-medium text-gray-500">
              Profile Sections
            </DropdownMenuLabel>
            {tabOptions.map((tab) => (
              <DropdownMenuItem 
                key={tab.value}
                className={cn(
                  "flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm",
                  "hover:bg-gray-50 transition-colors duration-200",
                  activeTab === tab.value ? "bg-gray-50 font-medium text-spiritless-pink" : ""
                )}
                onClick={() => handleTabClick(tab.value)}
              >
                <span className="pl-2">{tab.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        
        {userType === 'individual' && (
          <DropdownMenuItem asChild>
            <Link 
              to="/profile/bar-crawls" 
              className={cn(
                "user-profile-item flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm",
                "hover:bg-gray-50 transition-colors duration-200"
              )}
            >
              <Route className="h-4 w-4 text-gray-500" />
              <span>My Bar Crawls</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link 
            to="/settings" 
            className={cn(
              "user-profile-item flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm",
              "hover:bg-gray-50 transition-colors duration-200"
            )}
          >
            <Settings className="h-4 w-4 text-gray-500" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-1 bg-gray-100" />
        
        <DropdownMenuItem 
          className={cn(
            "user-profile-item flex items-center gap-2 text-red-600 cursor-pointer rounded-md px-3 py-2 text-sm",
            "hover:bg-red-50 transition-colors duration-200"
          )}
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
