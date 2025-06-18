
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import UserProfileDropdown from './UserProfileDropdown';
import { Menu, X } from 'lucide-react';

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
  const { isDevelopment } = useDevelopmentMode();
  const { userType, isAuthenticated, user } = useDevAuthBypass();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // In development mode, this would redirect to landing
    if (isDevelopment) {
      navigate('/landing');
    }
    // In production, implement actual logout logic
  };

  // Get username from user object or provide fallback
  const username = user?.user_metadata?.name || user?.email || 'User';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/map', label: 'Map' },
    { href: '/swig-circuits', label: 'Swig Circuits' },
    { href: '/events', label: 'Events' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-primary">
              Spiritless
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tab Options (if provided) */}
          {tabOptions && handleTabChange && (
            <div className="hidden md:block">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  {tabOptions.map((option) => (
                    <TabsTrigger key={option.value} value={option.value}>
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <UserProfileDropdown
                username={username}
                userType={userType || 'individual'}
                handleLogout={handleLogout}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                tabOptions={tabOptions}
              />
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <div className="px-3 py-2">
                    <UserProfileDropdown
                      username={username}
                      userType={userType || 'individual'}
                      handleLogout={handleLogout}
                      activeTab={activeTab}
                      handleTabChange={handleTabChange}
                      tabOptions={tabOptions}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
