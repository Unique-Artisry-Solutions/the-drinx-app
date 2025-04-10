
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileContent from './profile-dropdown/ProfileContent';
import ProfileDropdownButton from './profile-dropdown/ProfileDropdownButton';

interface TabOption {
  value: string;
  label: string;
}

interface UserProfileDropdownProps {
  username: string | null;
  userType: 'individual' | 'establishment' | 'promoter';
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
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const isPromoter = userType === 'promoter';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className={`w-9 h-9 rounded-full ${
              isPromoter 
                ? isDarkTheme 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300' 
                : isDarkTheme 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-background border-border hover:bg-accent'
            }`}
          >
            <User className={`h-4 w-4 ${isPromoter ? 'text-purple-600' : ''}`} />
            <span className="sr-only">Open user menu</span>
          </Button>
          <ProfileDropdownButton isDarkTheme={isDarkTheme} isPromoter={isPromoter} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`w-72 p-0 ${
          isDarkTheme 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white'
        }`}
      >
        <ProfileContent 
          username={username} 
          userType={userType} 
          isDarkTheme={isDarkTheme} 
          handleLogout={handleLogout}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabOptions={tabOptions}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
