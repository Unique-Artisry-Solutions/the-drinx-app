
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Route, GlassWater, BarChart4, Store } from 'lucide-react';
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
  const isEstablishmentPath = location.pathname.includes('/establishment/');
  
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
        isActive={location.pathname === getProfilePath()}
      >
        Profile
      </ProfileMenuItem>
      
      {userType === 'establishment' && isEstablishmentPath && tabOptions && 
        <ProfileTabOptions 
          tabOptions={tabOptions} 
          activeTab={activeTab} 
          handleTabChange={handleTabChange} 
          isDarkTheme={isDarkTheme} 
        />
      }
      
      {userType === 'establishment' ? (
        <>
          <ProfileMenuItem 
            to="/establishment/all-actions" 
            icon={Store} 
            isDarkTheme={isDarkTheme}
            isActive={location.pathname === '/establishment/all-actions'}
          >
            Dashboard
          </ProfileMenuItem>
          
          <ProfileMenuItem 
            to="/establishment/analytics" 
            icon={BarChart4} 
            isDarkTheme={isDarkTheme}
            isActive={location.pathname === '/establishment/analytics'}
          >
            Analytics
          </ProfileMenuItem>
        </>
      ) : (
        <>
          <ProfileMenuItem 
            to="/profile/bar-crawls" 
            icon={Route} 
            isDarkTheme={isDarkTheme}
            isActive={location.pathname === '/profile/bar-crawls'}
          >
            My Swig Circuits
          </ProfileMenuItem>
          
          <ProfileMenuItem 
            to="/profile/recipes" 
            icon={GlassWater} 
            isDarkTheme={isDarkTheme}
            isActive={location.pathname === '/profile/recipes'}
          >
            My Recipes
          </ProfileMenuItem>
        </>
      )}
      
      <ProfileMenuItem 
        to="/settings" 
        icon={Settings} 
        isDarkTheme={isDarkTheme}
        isActive={location.pathname === '/settings'}
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
