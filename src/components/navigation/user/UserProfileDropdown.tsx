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
  const isDarkTheme = theme === 'dark';
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
            isDarkTheme 
              ? "border-gray-700 bg-gray-800 hover:bg-gray-700" 
              : "border-gray-200 bg-white hover:bg-gray-50"
          )}
        >
          <User size={18} className="transition-transform duration-300 hover:scale-110" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "user-profile-dropdown w-56 backdrop-blur-sm shadow-md p-1 animate-fade-in",
          isDarkTheme 
            ? "bg-gray-800/90 border-gray-700" 
            : "bg-white/95 border border-gray-200"
        )}
      >
        {username && (
          <div className={cn(
            "px-3 py-2 text-sm font-medium mb-1",
            isDarkTheme 
              ? "text-gray-300 border-b border-gray-700" 
              : "text-gray-700 border-b border-gray-200"
          )}>
            Signed in as <span className="text-spiritless-pink">{username}</span>
          </div>
        )}
        
        <DropdownMenuItem asChild>
          <Link 
            to={getProfilePath()} 
            className={cn(
              "user-profile-item flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
              isDarkTheme 
                ? "hover:bg-gray-700/50 text-gray-200" 
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            <User className={isDarkTheme ? "h-4 w-4 text-gray-400" : "h-4 w-4 text-gray-700"} />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {isEstablishmentProfile && tabOptions && tabOptions.length > 0 && (
          <DropdownMenuGroup className={cn(
            "px-1 py-1 mt-1",
            isDarkTheme ? "border-t border-gray-700" : "border-t border-gray-200"
          )}>
            <DropdownMenuLabel className={cn(
              "px-3 py-1 text-xs font-medium",
              isDarkTheme ? "text-gray-400" : "text-gray-700"
            )}>
              Profile Sections
            </DropdownMenuLabel>
            
            {tabOptions.map(tab => (
              <DropdownMenuItem 
                key={tab.value} 
                className={cn(
                  "flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
                  isDarkTheme 
                    ? "hover:bg-gray-700/50" 
                    : "hover:bg-gray-100",
                  activeTab === tab.value 
                    ? isDarkTheme 
                      ? "bg-gray-700/50 font-medium text-spiritless-pink" 
                      : "bg-gray-100 font-medium text-spiritless-pink" 
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
                  "user-profile-item flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
                  isDarkTheme 
                    ? "hover:bg-gray-700/50 text-gray-200" 
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <Route className={isDarkTheme ? "h-4 w-4 text-gray-400" : "h-4 w-4 text-gray-700"} />
                <span>My Swig Circuits</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link 
                to="/profile?tab=recipes" 
                className={cn(
                  "user-profile-item flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
                  isDarkTheme 
                    ? "hover:bg-gray-700/50 text-gray-200" 
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <GlassWater className={isDarkTheme ? "h-4 w-4 text-gray-400" : "h-4 w-4 text-gray-700"} />
                <span>My Recipes</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link 
            to="/settings" 
            className={cn(
              "user-profile-item flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
              isDarkTheme 
                ? "hover:bg-gray-700/50 text-gray-200" 
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            <Settings className={isDarkTheme ? "h-4 w-4 text-gray-400" : "h-4 w-4 text-gray-700"} />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={isDarkTheme ? "my-1 bg-gray-700" : "my-1 bg-gray-200"} />
        
        <DropdownMenuItem 
          className={cn(
            "user-profile-item flex items-center gap-2 text-red-600 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
            isDarkTheme ? "hover:bg-red-900/20" : "hover:bg-red-50"
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
