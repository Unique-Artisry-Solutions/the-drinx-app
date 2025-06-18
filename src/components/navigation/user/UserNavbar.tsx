
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu, User, Bell, Settings, LogOut, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import UserProfileDropdown from './UserProfileDropdown';

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
  const { 
    user: authUser, 
    isAuthenticated: authIsAuthenticated, 
    signOut 
  } = useAuth();
  
  const { 
    user: devUser, 
    isAuthenticated: devIsAuthenticated, 
    isUsingDevBypass 
  } = useDevAuthBypass();
  
  const { isDevelopment } = useDevelopmentMode();

  // Use dev auth if bypassing, otherwise use real auth
  const user = isUsingDevBypass ? devUser : authUser;
  const isAuthenticated = isUsingDevBypass ? devIsAuthenticated : authIsAuthenticated;

  const handleSignOut = async () => {
    if (isUsingDevBypass) {
      // In dev mode, just navigate to landing
      navigate('/landing');
    } else {
      await signOut();
      navigate('/landing');
    }
  };

  const navItems = [
    { href: '/explore', label: 'Explore', icon: Home },
    { href: '/map', label: 'Map' },
    { href: '/events', label: 'Events' },
    { href: '/swig-circuits', label: 'Circuits' },
    { href: '/social', label: 'Social' }
  ];

  const mobileNavItems = isAuthenticated 
    ? [
        { href: '/profile', label: 'Profile', icon: User },
        { href: '/settings', label: 'Settings', icon: Settings },
        { href: '/notifications', label: 'Notifications', icon: Bell }
      ]
    : [];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-spiritless-pink">Spiritless</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'border-spiritless-pink text-spiritless-pink'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tabs (if provided) */}
          {tabOptions && handleTabChange && (
            <div className="flex items-center">
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

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Development Mode Indicator */}
            {isDevelopment && isUsingDevBypass && (
              <Badge variant="secondary" className="text-xs">
                Dev Mode
              </Badge>
            )}

            {/* Desktop Auth Section */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/notifications')}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                  <UserProfileDropdown />
                </>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* User Info */}
                    {isAuthenticated && user && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-spiritless-pink rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {user.user_metadata?.name || user.email || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Items */}
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                        >
                          {item.icon && <item.icon className="h-5 w-5" />}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Mobile Auth Items */}
                    {isAuthenticated ? (
                      <div className="space-y-2 border-t pt-4">
                        {mobileNavItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 w-full text-left text-red-600"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 border-t pt-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/login')}
                        >
                          Sign In
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => navigate('/signup')}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
