import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Route, GlassWater, BarChart4, Store, Megaphone, Bell } from 'lucide-react';
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
  userType: 'individual' | 'establishment' | 'promoter';
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
  const isPromoter = userType === 'promoter';
  
  const getProfilePath = () => {
    if (userType === 'establishment') {
      return '/establishment/profile';
    } else if (userType === 'promoter') {
      return '/promoter/dashboard';
    }
    return '/profile';
  };

  const getNotificationsPath = () => {
    if (userType === 'establishment') {
      return '/establishment/notifications';
    } else if (userType === 'promoter') {
      return '/promoter/notifications';
    }
    return '/notifications';
  };

  return (
    <div className="py-2 group space-y-1">
      <ProfileHeader 
        username={username} 
        isDarkTheme={isDarkTheme} 
        isPromoter={isPromoter} 
      />
      
      <ProfileMenuItem 
        to={getNotificationsPath()} 
        icon={Bell} 
        isDarkTheme={isDarkTheme}
        isActive={location.pathname === getNotificationsPath()}
        customColor={userType === 'promoter' ? "text-purple-600" : undefined}
      >
        Notifications
      </ProfileMenuItem>
      
      <ProfileMenuItem 
        to={getProfilePath()} 
        icon={userType === 'promoter' ? Megaphone : User} 
        isDarkTheme={isDarkTheme}
        isActive={location.pathname === getProfilePath() || location.pathname.startsWith('/promoter/')}
        customColor={userType === 'promoter' ? "text-purple-600" : undefined}
      >
        {userType === 'promoter' ? 'Dashboard' : 'Profile'}
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
            to="/establishment/dashboard" 
            icon={Store} 
            isDarkTheme={isDarkTheme}
            isActive={location.pathname === '/establishment/dashboard'}
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
      ) : userType === 'promoter' ? (
        <>
          <ProfileMenuItem 
            to="/promoter/analytics" 
            icon={BarChart4} 
            isDarkTheme={isDarkTheme}
            isActive={location.pathname === '/promoter/analytics'}
            customColor="text-purple-600"
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
        <span className="text-red-600 hover:text-red-700">Logout</span>
      </ProfileMenuItem>
    </div>
  );
};

export default ProfileContent;
