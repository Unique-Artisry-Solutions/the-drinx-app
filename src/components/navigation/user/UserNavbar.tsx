
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { supabase } from '@/lib/supabase';
import UserProfileDropdown from './UserProfileDropdown';
import UserNavLinks from './UserNavLinks';
import UserMobileMenu from './UserMobileMenu';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';
import { RoleSwitcher } from '../RoleSwitcher';
import CartButton from '@/components/cart/CartButton';

interface TabOption {
  value: string;
  label: string;
}

interface UserNavbarProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserNavbar: React.FC<UserNavbarProps> = ({
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goToHomePage } = useAppNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>("Guest");
  const { theme } = useTheme();
  const { signOut } = useAuth();
  const { 
    user, 
    userType, 
    isAuthenticated 
  } = useAuthenticatedUser();
  const isMobile = useIsMobile();
  
  // Convert userType to non-admin type for components that don't handle admin
  const nonAdminUserType = userType === 'admin' ? 'individual' : (userType || 'individual');
  
  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
        try {
          // For real users, fetch from database
          const { data, error } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', user.id)
            .single();
          
          if (data && !error) {
            setUsername(data.display_name || data.username || "Guest User");
          } else {
            setUsername("Guest User");
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername("Guest User");
        }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername("Guest User");
        }
      } else {
        setUsername('Guest User');
      }
    };
    
    fetchUsername();
  }, [user, userType]);
  
  const handleLogout = async () => {
    try {
      console.log('UserNavbar: Initiating logout via Auth context');
      // Use the Auth context signOut method to ensure consistent behavior
      await signOut();
      // No need to navigate here as signOut already redirects to landing
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback redirect in case the signOut method fails
      window.location.href = '/landing';
    }
  };
  
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default navigation
    goToHomePage(userType || 'individual');
  };
  
  const getTabOptions = () => {
    if (location.pathname === '/establishment/profile' && tabOptions) {
      return tabOptions;
    }
    return undefined;
  };
  
  const isDarkTheme = theme === 'dark';
  let navbarClass = isDarkTheme ? 'bg-gray-900 shadow-md border-b border-gray-800' : 'bg-white shadow-sm';
  
  // Add a custom class for promoter navigation
  if (userType === 'promoter') {
    navbarClass = isDarkTheme 
      ? 'bg-gray-900 shadow-md border-b border-gray-800' 
      : 'bg-white shadow-sm border-b-2 border-purple-200';
  }
  
  return (
    <nav className={`user-top-nav fixed top-0 left-0 w-full z-50 ${navbarClass}`}>
      <div className="user-nav-container max-w-6xl mx-auto px-4 py-3">
        <div className="user-nav-inner flex items-center justify-between">
          <div className="user-nav-left flex items-center">
            <Link to="#" onClick={handleHomeClick} className={`user-nav-logo text-xl font-semibold mr-6 ${userType === 'promoter' ? 'text-purple-600' : ''}`}>
              {isMobile ? "SL" : "Spirit"}
              {!isMobile && <span>less</span>}
              {userType === 'promoter' && !isMobile && <span className="ml-1 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-md">Promoter</span>}
              {userType === 'establishment' && !isMobile && <span className="ml-1 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md">Establishment</span>}
            </Link>
            
            <UserNavLinks userType={nonAdminUserType} />
          </div>
          
          <div className="user-nav-right flex items-center space-x-4">
            {username && (
              <span className="text-sm hidden md:block">
                Welcome, <span className={`font-medium ${userType === 'promoter' ? 'text-purple-600' : userType === 'establishment' ? 'text-blue-600' : 'text-spiritless-pink'}`}>{username}</span>
              </span>
            )}
            
            <RoleSwitcher />
            
            {/* Apply proper stacking context for notifications and cart */}
            <div className="relative z-40">
              <NotificationsPopover />
            </div>
            
            <div className="relative z-40">
              <CartButton />
            </div>
            
            <UserProfileDropdown 
              username={username} 
              userType={nonAdminUserType} 
              handleLogout={handleLogout} 
              activeTab={location.pathname === '/establishment/profile' ? activeTab : undefined} 
              handleTabChange={location.pathname === '/establishment/profile' ? handleTabChange : undefined} 
              tabOptions={getTabOptions()} 
            />
          </div>
        </div>
        
        <UserMobileMenu 
          isOpen={isMobileMenuOpen} 
          username={username} 
          userType={nonAdminUserType} 
          onClose={() => setIsMobileMenuOpen(false)} 
          handleLogout={handleLogout} 
          activeTab={location.pathname === '/establishment/profile' ? activeTab : undefined} 
          handleTabChange={location.pathname === '/establishment/profile' ? handleTabChange : undefined} 
          tabOptions={getTabOptions()} 
        />
      </div>
    </nav>
  );
};

export default UserNavbar;
