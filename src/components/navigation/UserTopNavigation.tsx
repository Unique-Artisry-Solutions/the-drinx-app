
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Map, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

const UserTopNavigation: React.FC = () => {
  const location = useLocation();
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

    // Fetch username if user is logged in
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
    await signOut();
    navigate('/landing');
  };

  const userNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
  ];
  
  if (userType === 'individual') {
    userNavItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  } else {
    userNavItems.push({ icon: Route, label: 'Add', path: '/add' });
  }

  const getProfilePath = () => {
    if (userType === 'establishment') {
      return '/establishment/profile';
    }
    return '/profile';
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
            
            <div className="user-nav-links hidden md:flex space-x-1">
              {userNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`user-nav-link px-3 py-2 rounded-md flex items-center ${
                      isActive ? 'bg-material-primary/10 text-material-primary' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="user-profile-button">
                  <User size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="user-profile-dropdown">
                {username && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-500">
                      Signed in as <span className="text-spiritless-pink">{username}</span>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to={getProfilePath()} className="user-profile-item flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="user-profile-item flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="user-profile-item flex items-center gap-2 text-red-600 cursor-pointer" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="user-mobile-menu md:hidden py-3 space-y-2">
            {username && (
              <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100 mb-2 pb-2">
                Welcome, <span className="font-medium text-spiritless-pink">{username}</span>
              </div>
            )}
            {userNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`user-mobile-link block px-3 py-2 rounded-md ${
                    isActive ? 'bg-material-primary/10 text-material-primary' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <Link
              to={getProfilePath()}
              className="user-mobile-link block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                <span>Profile</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserTopNavigation;
