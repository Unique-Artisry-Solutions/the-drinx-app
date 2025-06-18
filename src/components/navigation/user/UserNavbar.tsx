
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { toStandardUserType } from '@/types/auth';

interface TabOption {
  value: string;
  label: string;
}

interface UserNavbarProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserNavbar: React.FC<UserNavbarProps> = ({ activeTab, handleTabChange, tabOptions }) => {
  const { theme, toggleTheme } = useTheme();
  const { userType, isAuthenticated, user } = useDevAuthBypass();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    // In development mode, we just clear the dev auth state
    // In production, this would call actual logout logic
    console.log('Logout requested');
  };

  const isDarkTheme = theme === 'dark';

  // Convert admin user type to standard user type for dropdown
  const dropdownUserType = toStandardUserType(userType);

  if (!isAuthenticated || !userType) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b ${
      isDarkTheme 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    } backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/explore" className="flex items-center">
              <span className={`text-xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>
                Firefly
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <UserProfileDropdown
              username={user?.user_metadata?.name || user?.email || 'User'}
              userType={dropdownUserType}
              handleLogout={handleLogout}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              tabOptions={tabOptions}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={isDarkTheme ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pb-3 space-y-1 sm:px-3">
              <UserProfileDropdown
                username={user?.user_metadata?.name || user?.email || 'User'}
                userType={dropdownUserType}
                handleLogout={handleLogout}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                tabOptions={tabOptions}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
