
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TabOption {
  value: string;
  label: string;
}

interface UserMobileMenuProps {
  isOpen: boolean;
  username: string | null;
  userType: 'individual' | 'establishment';
  onClose: () => void;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserMobileMenu: React.FC<UserMobileMenuProps> = ({ 
  isOpen, 
  username, 
  userType, 
  onClose,
  activeTab,
  handleTabChange,
  tabOptions
}) => {
  const location = useLocation();
  const isEstablishmentProfile = location.pathname === '/establishment/profile';

  if (!isOpen) return null;

  const handleTabClick = (tab: string) => {
    if (handleTabChange) {
      handleTabChange(tab);
      onClose();
    }
  };
  
  return (
    <div className="user-mobile-menu fixed inset-0 z-50 bg-white" onClick={onClose}>
      <div className="mobile-menu-container h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header border-b p-4 flex items-center justify-between">
          <div className="user-welcome">
            <p className="text-sm text-gray-500">Welcome,</p>
            <p className="font-medium text-spiritless-pink">{username || 'Guest'}</p>
          </div>
          <button 
            className="close-button p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Menu</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/explore" 
                  className={({ isActive }) => cn(
                    "block p-3 rounded-md",
                    isActive ? "bg-gray-100 text-spiritless-pink font-medium" : "text-gray-700"
                  )}
                  onClick={onClose}
                >
                  Explore
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/map" 
                  className={({ isActive }) => cn(
                    "block p-3 rounded-md",
                    isActive ? "bg-gray-100 text-spiritless-pink font-medium" : "text-gray-700"
                  )}
                  onClick={onClose}
                >
                  Map
                </NavLink>
              </li>
              
              {userType === 'establishment' && (
                <li>
                  <NavLink 
                    to="/establishment/profile" 
                    className={({ isActive }) => cn(
                      "block p-3 rounded-md",
                      isActive ? "bg-gray-100 text-spiritless-pink font-medium" : "text-gray-700"
                    )}
                    onClick={onClose}
                  >
                    Establishment Profile
                  </NavLink>
                </li>
              )}
              
              {isEstablishmentProfile && tabOptions && tabOptions.length > 0 && (
                <li className="pl-4 border-l border-gray-200 ml-3 mt-2">
                  <h4 className="text-xs uppercase font-semibold text-gray-500 mb-1 ml-2">Profile Sections</h4>
                  <ul className="space-y-1">
                    {tabOptions.map((tab) => (
                      <li key={tab.value}>
                        <button 
                          className={cn(
                            "w-full text-left p-2 rounded-md text-sm",
                            activeTab === tab.value 
                              ? "bg-gray-100 text-spiritless-pink font-medium" 
                              : "text-gray-700"
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
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Account</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to={userType === 'establishment' ? '/establishment/profile' : '/profile'} 
                  className={({ isActive }) => cn(
                    "block p-3 rounded-md",
                    isActive ? "bg-gray-100 text-spiritless-pink font-medium" : "text-gray-700"
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
                      isActive ? "bg-gray-100 text-spiritless-pink font-medium" : "text-gray-700"
                    )}
                    onClick={onClose}
                  >
                    My Bar Crawls
                  </NavLink>
                </li>
              )}
              
              <li>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => cn(
                    "block p-3 rounded-md",
                    isActive ? "bg-gray-100 text-spiritless-pink font-medium" : "text-gray-700"
                  )}
                  onClick={onClose}
                >
                  Settings
                </NavLink>
              </li>
              
              <li>
                <a 
                  href="/login" 
                  className="block p-3 rounded-md text-red-600"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    // This is just a placeholder - the actual logout logic would be handled in the parent component
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMobileMenu;
