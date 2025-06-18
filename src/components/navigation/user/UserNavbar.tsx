
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Menu, X } from 'lucide-react';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import UserProfileDropdown from './UserProfileDropdown';
import { UserType, toStandardUserType, isStandardUserType } from '@/types/auth';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDevelopment, disableDevMode } = useDevelopmentMode();
  
  const { 
    userType, 
    isAuthenticated, 
    user, 
    isUsingDevBypass 
  } = useDevAuthBypass();

  const handleLogout = async () => {
    if (isDevelopment && isUsingDevBypass) {
      disableDevMode();
      navigate('/landing');
    } else {
      // Handle real logout when implemented
      console.log('Real logout not implemented yet');
      navigate('/landing');
    }
  };

  const getUsernameFromUser = (user: any): string => {
    if (!user) return 'User';
    
    return user.user_metadata?.username || 
           user.user_metadata?.name || 
           user.user_metadata?.display_name ||
           user.email?.split('@')[0] ||
           'User';
  };

  const username = getUsernameFromUser(user);

  // Convert admin user type to individual for components that don't handle admin
  const profileDropdownUserType = isStandardUserType(userType) 
    ? userType 
    : toStandardUserType(userType);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/landing" className="flex items-center">
                <Home className="h-8 w-8 text-spiritless-pink" />
                <span className="ml-2 text-xl font-bold text-gray-900">Spiritless</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Home className="h-8 w-8 text-spiritless-pink" />
              <span className="ml-2 text-xl font-bold text-gray-900">Spiritless</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {tabOptions && tabOptions.length > 0 && (
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-4">
                  {tabOptions.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Desktop Profile Dropdown */}
          <div className="hidden md:flex items-center">
            <UserProfileDropdown
              username={username}
              userType={profileDropdownUserType}
              handleLogout={handleLogout}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              tabOptions={tabOptions}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {tabOptions && tabOptions.length > 0 && (
                <div className="space-y-1">
                  {tabOptions.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        handleTabChange?.(tab.value);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block px-3 py-2 text-base font-medium w-full text-left ${
                        activeTab === tab.value
                          ? 'text-spiritless-pink bg-spiritless-pink/10'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-xs"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
