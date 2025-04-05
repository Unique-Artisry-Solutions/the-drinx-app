
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Route, GlassWater } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
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
          className={cn(
            "user-profile-button h-9 w-9 rounded-full transition-all duration-300 hover:text-spiritless-pink",
            isLightTheme 
              ? "border-gray-300 bg-[#f5f3ed] hover:bg-gray-100" 
              : "border-gray-200 bg-white hover:bg-gray-50"
          )}
        >
          <User size={18} className="transition-transform duration-300 hover:scale-110" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "user-profile-dropdown w-56 backdrop-blur-sm border rounded-lg p-1 animate-fade-in shadow-md",
          isLightTheme 
            ? "bg-[#f5f3ed]/95 border-gray-200" 
            : "bg-indigo-400/90 border-gray-100"
        )}
      >
        {username && (
          <div className={cn(
            "px-3 py-2 text-sm font-medium border-b mb-1",
            isLightTheme 
              ? "text-gray-700 border-gray-200" 
              : "text-gray-500 border-gray-100"
          )}>
            Signed in as <span className="text-spiritless-pink">{username}</span>
          </div>
        )}
        
        <DropdownMenuItem asChild>
          <Link 
            to={getProfilePath()} 
            className={cn(
              "user-profile-item flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-200",
              isLightTheme 
                ? "hover:bg-gray-200/70 text-gray-700" 
                : "hover:bg-gray-50 text-gray-800"
            )}
          >
            <User className={isLightTheme ? "h-4 w-4 text-gray-700" : "h-4 w-4 text-gray-500"} />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {isEstablishmentProfile && tabOptions && tabOptions.length > 0 && (
          <DropdownMenuGroup className={cn(
            "px-1 py-1 mt-1 border-t",
            isLightTheme ? "border-gray-200" : "border-gray-100"
          )}>
            <DropdownMenuLabel className={cn(
              "px-3 py-1 text-xs font-medium",
              isLightTheme ? "text-gray-700" : "text-gray-500"
            )}>
              Profile Sections
            </DropdownMenuLabel>
            
            {tabOptions.map(tab => (
              <DropdownMenuItem 
                key={tab.value} 
                className={cn(
                  "flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-200",
                  isLightTheme 
                    ? "hover:bg-gray-200/70" 
                    : "hover:bg-gray-50",
                  activeTab === tab.value 
                    ? isLightTheme 
                      ? "bg-gray-200/70 font-medium text-spiritless-pink" 
                      : "bg-gray-50 font-medium text-spiritless-pink" 
                    : ""
                )} 
                onClick={() => handleTabClick(tab.value)}
              >
                <span className="pl-2">{tab.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        
        {userType === 'individual' && (
          <>
            <DropdownMenuItem asChild>
              <Link 
                to="/profile/bar-crawls" 
                className={cn(
                  "user-profile-item flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-200",
                  isLightTheme 
                    ? "hover:bg-gray-200/70 text-gray-700" 
                    : "hover:bg-gray-50 text-gray-800"
                )}
              >
                <Route className={isLightTheme ? "h-4 w-4 text-gray-700" : "h-4 w-4 text-gray-500"} />
                <span>My Swig Circuits</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link 
                to="/profile?tab=recipes" 
                className={cn(
                  "user-profile-item flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-200",
                  isLightTheme 
                    ? "hover:bg-gray-200/70 text-gray-700" 
                    : "hover:bg-gray-50 text-gray-800"
                )}
              >
                <GlassWater className={isLightTheme ? "h-4 w-4 text-gray-700" : "h-4 w-4 text-gray-500"} />
                <span>My Recipes</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link 
            to="/settings" 
            className={cn(
              "user-profile-item flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-200",
              isLightTheme 
                ? "hover:bg-gray-200/70 text-gray-700" 
                : "hover:bg-gray-50 text-gray-800"
            )}
          >
            <Settings className={isLightTheme ? "h-4 w-4 text-gray-700" : "h-4 w-4 text-gray-500"} />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={isLightTheme ? "my-1 bg-gray-200" : "my-1 bg-gray-100"} />
        
        <DropdownMenuItem 
          className={cn(
            "user-profile-item flex items-center gap-2 text-red-600 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-200",
            isLightTheme ? "hover:bg-red-50/70" : "hover:bg-red-50"
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
