
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Route, GlassWater } from 'lucide-react';
import { 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import ProfileHeader from './ProfileHeader';
import ProfileMenuItem from './ProfileMenuItem';
import ProfileTabOptions from './ProfileTabOptions';
import { profileDropdownStyles } from './profileDropdownStyles';

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
    <>
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
      
      <DropdownMenuSeparator className={profileDropdownStyles.separator(isDarkTheme)} />
      
      <ProfileMenuItem 
        to="#" 
        icon={LogOut} 
        isDarkTheme={isDarkTheme}
        onClick={handleLogout}
      >
        <span className="text-red-600">Logout</span>
      </ProfileMenuItem>
    </>
  );
};

export default ProfileContent;
