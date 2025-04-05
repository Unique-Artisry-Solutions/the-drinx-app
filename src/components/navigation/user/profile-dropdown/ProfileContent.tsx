
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Route, GlassWater } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenuContent, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import ProfileHeader from './ProfileHeader';
import ProfileMenuItem from './ProfileMenuItem';
import ProfileTabOptions from './ProfileTabOptions';

interface TabOption {
  value: string;
  label: string;
}

interface ProfileContentProps {
  username: string | null;
  userType: 'individual' | 'establishment';
  isDarkTheme: boolean;
  handleLogout: () => Promise<void>;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  username,
  userType,
  isDarkTheme,
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

  return (
    <DropdownMenuContent 
      align="end" 
      className={cn(
        "user-profile-dropdown w-56 backdrop-blur-sm shadow-md p-1 animate-fade-in",
        isDarkTheme 
          ? "bg-gray-800/90 border-gray-700" 
          : "bg-white/95 border border-gray-200"
      )}
    >
      <ProfileHeader username={username} isDarkTheme={isDarkTheme} />
      
      <ProfileMenuItem 
        to={getProfilePath()} 
        icon={User} 
        isDarkTheme={isDarkTheme}
      >
        Profile
      </ProfileMenuItem>
      
      {isEstablishmentProfile && tabOptions && 
        <ProfileTabOptions 
          tabOptions={tabOptions} 
          activeTab={activeTab} 
          handleTabChange={handleTabChange} 
          isDarkTheme={isDarkTheme} 
        />
      }
      
      {userType === 'individual' && (
        <>
          <ProfileMenuItem 
            to="/profile/bar-crawls" 
            icon={Route} 
            isDarkTheme={isDarkTheme}
          >
            My Swig Circuits
          </ProfileMenuItem>
          
          <ProfileMenuItem 
            to="/profile?tab=recipes" 
            icon={GlassWater} 
            isDarkTheme={isDarkTheme}
          >
            My Recipes
          </ProfileMenuItem>
        </>
      )}
      
      <ProfileMenuItem 
        to="/settings" 
        icon={Settings} 
        isDarkTheme={isDarkTheme}
      >
        Settings
      </ProfileMenuItem>
      
      <DropdownMenuSeparator className={isDarkTheme ? "my-1 bg-gray-700" : "my-1 bg-gray-200"} />
      
      <ProfileMenuItem 
        to="#" 
        icon={LogOut} 
        isDarkTheme={isDarkTheme}
        onClick={handleLogout}
      >
        <span className="text-red-600">Logout</span>
      </ProfileMenuItem>
    </DropdownMenuContent>
  );
};

export default ProfileContent;
