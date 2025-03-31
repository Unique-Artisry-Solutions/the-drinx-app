
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import UserProfileDropdown from './UserProfileDropdown';
import UserNavLinks from './UserNavLinks';
import UserMobileMenu from './UserMobileMenu';

const UserTopNav: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  const [username, setUsername] = useState<string | null>(null);
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

  return (
    <nav className="user-top-nav fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="user-nav-container max-w-6xl mx-auto px-4 py-3">
        <div className="user-nav-inner flex items-center justify-between">
          <div className="user-nav-left flex items-center">
            <Link to="/" className="user-nav-logo text-xl font-semibold text-material-primary mr-6">
              {isMobile ? "SL" : "Spirit"}
              {!isMobile && <span>less</span>}
            </Link>
            
            <UserNavLinks userType={userType} />
          </div>
          
          <div className="user-nav-right flex items-center space-x-4">
            {username && (
              <span className="text-sm hidden md:block text-gray-600">
                Welcome, <span className="font-medium text-spiritless-pink">{username}</span>
              </span>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="user-menu-button md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
            
            <UserProfileDropdown 
              username={username} 
              userType={userType} 
              handleLogout={handleLogout} 
            />
          </div>
        </div>
        
        <UserMobileMenu 
          isOpen={isMobileMenuOpen} 
          username={username} 
          userType={userType} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </div>
    </nav>
  );
};

export default UserTopNav;
