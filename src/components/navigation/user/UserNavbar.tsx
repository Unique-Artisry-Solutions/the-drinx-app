
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
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
  const [username, setUsername] = useState<string | null>(null);
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
            setUsername(data.display_name || data.username || null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
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
        navigate('/');
      } else {
        navigate('/explore');
      }
    } else {
      navigate('/landing');
    }
  };

  // Check if we're on the establishment profile page to pass down the correct props
  const isEstablishmentProfile = location.pathname === '/establishment/profile';

  return (
    <nav className="user-top-nav fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="user-nav-container max-w-6xl mx-auto px-4 py-3">
        <div className="user-nav-inner flex items-center justify-between">
          <div className="user-nav-left flex items-center">
            <a 
              href="#" 
              onClick={handleHomeClick} 
              className="user-nav-logo text-xl font-semibold mr-6"
            >
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
            
            <button 
              className="user-menu-button md:hidden bg-transparent border-none flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
            
            <UserProfileDropdown 
              username={username} 
              userType={userType} 
              handleLogout={handleLogout} 
              activeTab={isEstablishmentProfile ? activeTab : undefined} 
              handleTabChange={isEstablishmentProfile ? handleTabChange : undefined} 
              tabOptions={isEstablishmentProfile ? tabOptions : undefined} 
            />
          </div>
        </div>
        
        <UserMobileMenu 
          isOpen={isMobileMenuOpen} 
          username={username} 
          userType={userType} 
          onClose={() => setIsMobileMenuOpen(false)} 
          activeTab={isEstablishmentProfile ? activeTab : undefined} 
          handleTabChange={isEstablishmentProfile ? handleTabChange : undefined} 
          tabOptions={isEstablishmentProfile ? tabOptions : undefined} 
        />
      </div>
    </nav>
  );
};

export default UserNavbar;
