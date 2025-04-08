
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabase';
import UserProfileDropdown from './UserProfileDropdown';
import UserNavLinks from './UserNavLinks';
import UserMobileMenu from './UserMobileMenu';
import { useTheme } from '@/contexts/ThemeContext';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  const [username, setUsername] = useState<string | null>("Guest");
  const { theme } = useTheme();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const storedUserType = localStorage.getItem('user_type');
    if (storedUserType === 'establishment') {
      setUserType('establishment');
    } else {
      setUserType('individual');
    }
    
    const fetchUsername = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', user.id)
            .single();
          
          if (data && !error) {
            setUsername(data.display_name || data.username || "Guest User");
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
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default navigation

    if (user) {
      if (userType === 'establishment') {
        navigate('/establishment/all-actions');
      } else {
        navigate('/explore');
      }
    } else {
      navigate('/landing');
    }
  };
  
  const getTabOptions = () => {
    if (location.pathname === '/establishment/profile' && tabOptions) {
      return tabOptions;
    }
    return undefined;
  };
  
  const isDarkTheme = theme === 'dark';
  const navbarClass = isDarkTheme ? 'bg-gray-900 shadow-md border-b border-gray-800' : 'bg-white shadow-sm';
  
  return (
    <nav className={`user-top-nav fixed top-0 left-0 w-full z-50 ${navbarClass}`}>
      <div className="user-nav-container max-w-6xl mx-auto px-4 py-3">
        <div className="user-nav-inner flex items-center justify-between">
          <div className="user-nav-left flex items-center">
            <a href="#" onClick={handleHomeClick} className="user-nav-logo text-xl font-semibold mr-6">
              {isMobile ? "SL" : "Spirit"}
              {!isMobile && <span>less</span>}
            </a>
            
            <UserNavLinks userType={userType} />
          </div>
          
          <div className="user-nav-right flex items-center space-x-4">
            {username && (
              <span className="text-sm hidden md:block">
                Welcome, <span className="font-medium text-spiritless-pink">{username}</span>
              </span>
            )}
            
            <UserProfileDropdown 
              username={username} 
              userType={userType} 
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
          userType={userType} 
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
