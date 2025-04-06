
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface TabOption {
  value: string;
  label: string;
}

interface UserMobileMenuProps {
  isOpen: boolean;
  username: string | null;
  userType: 'individual' | 'establishment';
  onClose: () => void;
  handleLogout: () => Promise<void>; // Added logout handler
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserMobileMenu: React.FC<UserMobileMenuProps> = ({ 
  isOpen, 
  username, 
  userType, 
  onClose,
  handleLogout,
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isEstablishmentProfile = location.pathname === '/establishment/profile';
  
  const isDarkTheme = theme === 'dark';
  const bgClass = isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const borderClass = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  if (!isOpen) return null;

  const handleTabClick = (tab: string) => {
    if (handleTabChange) {
      handleTabChange(tab);
      onClose();
    }
  };

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleLogout();
    onClose();
  };
  
  return (
    <div className={`user-mobile-menu fixed inset-0 z-50 ${bgClass}`} onClick={onClose}>
      <div className={`mobile-menu-container h-full overflow-y-auto ${bgClass}`} onClick={(e) => e.stopPropagation()}>
        <div className={`mobile-menu-header ${borderClass} border-b p-4 flex items-center justify-between`}>
          <div className="user-welcome">
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome,</p>
            <p className="font-medium text-spiritless-pink">{username || 'Guest'}</p>
          </div>
          <button 
            className="close-button p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="mobile-menu-content p-4">
          <div className="mobile-menu-section">
            <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">Menu</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/explore" 
                  className={({ isActive }) => cn(
                    "block p-3 rounded-md",
                    isActive ? `bg-gray-100 text-spiritless-pink font-medium ${isDarkTheme ? 'bg-gray-800' : ''}` : "text-gray-700 dark:text-gray-300"
                  )}
                  onClick={onClose}
                >
                  Explore
                </NavLink>
              </li>
              
              {userType === 'establishment' && (
                <li>
                  <NavLink 
                    to="/establishment/profile" 
                    className={({ isActive }) => cn(
                      "block p-3 rounded-md",
                      isActive ? `bg-gray-100 text-spiritless-pink font-medium ${isDarkTheme ? 'bg-gray-800' : ''}` : "text-gray-700 dark:text-gray-300"
                    )}
                    onClick={onClose}
                  >
                    Establishment Profile
                  </NavLink>
                </li>
              )}
              
              {isEstablishmentProfile && tabOptions && tabOptions.length > 0 && (
                <li className={`pl-4 border-l ${borderClass} ml-3 mt-2`}>
                  <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-2">Profile Sections</h4>
                  <ul className="space-y-1">
                    {tabOptions.map((tab) => (
                      <li key={tab.value}>
                        <button 
                          className={cn(
                            "w-full text-left p-2 rounded-md text-sm",
                            activeTab === tab.value 
                              ? `bg-gray-100 text-spiritless-pink font-medium ${isDarkTheme ? 'bg-gray-800' : ''}` 
                              : "text-gray-700 dark:text-gray-300"
                          )}
                          onClick={() => handleTabClick(tab.value)}
                        >
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
          
          <div className="mobile-menu-section mt-6">
            <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">Account</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to={userType === 'establishment' ? '/establishment/profile' : '/profile'} 
                  className={({ isActive }) => cn(
                    "block p-3 rounded-md",
                    isActive ? `bg-gray-100 text-spiritless-pink font-medium ${isDarkTheme ? 'bg-gray-800' : ''}` : "text-gray-700 dark:text-gray-300"
                  )}
                  onClick={onClose}
                >
                  Profile
                </NavLink>
              </li>
              
              {userType === 'individual' && (
                <li>
                  <NavLink 
                    to="/profile/bar-crawls" 
                    className={({ isActive }) => cn(
                      "block p-3 rounded-md",
                      isActive ? `bg-gray-100 text-spiritless-pink font-medium ${isDarkTheme ? 'bg-gray-800' : ''}` : "text-gray-700 dark:text-gray-300"
                    )}
                    onClick={onClose}
                  >
                    My Swig Circuits
                  </NavLink>
                </li>
              )}
              
              <li>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => cn(
                    "block p-3 rounded-md",
                    isActive ? `bg-gray-100 text-spiritless-pink font-medium ${isDarkTheme ? 'bg-gray-800' : ''}` : "text-gray-700 dark:text-gray-300"
                  )}
                  onClick={onClose}
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMobileMenu;
