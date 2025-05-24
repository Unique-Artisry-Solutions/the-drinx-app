
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import HomeButton from './HomeButton';
import NavItem from './NavItem';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { NavigationType } from '@/types/navigation/NavigationTypes';

interface NavigationBarProps {
  navItems: UnifiedNavItem[];
  type: NavigationType;
  handleHomeClick: (e: React.MouseEvent) => void;
  handleProfileClick: (item: UnifiedNavItem, e: React.MouseEvent) => void;
  getProfilePath: () => string;
  currentUserType: 'individual' | 'establishment' | 'promoter';
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  navItems,
  type,
  handleHomeClick,
  handleProfileClick,
  getProfilePath,
  currentUserType,
}) => {
  const location = useLocation();
  const { theme } = useTheme();

  const getNavBarClasses = () => {
    const baseClasses = "fixed bottom-0 left-0 right-0 w-full shadow-lg z-50 md:hidden border-t backdrop-blur-sm transition-all duration-300";
    
    if (theme === 'dark') {
      return `${baseClasses} bg-gray-900/95 border-gray-700`;
    }
    
    switch (currentUserType) {
      case 'promoter':
        return `${baseClasses} bg-white/95 border-purple-200`;
      case 'establishment':
        return `${baseClasses} bg-white/95 border-blue-200`;
      case 'individual':
      default:
        return `${baseClasses} bg-white/95 border-gray-100`;
    }
  };

  return (
    <nav className={getNavBarClasses()}>
      <div className="mx-auto w-full">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = 
              location.pathname === item.path || 
              (item.path === '/profile' && location.pathname.startsWith('/profile/')) ||
              (item.path === '/establishment/profile' && location.pathname.startsWith('/establishment/')) ||
              (item.path === '/promoter/profile' && location.pathname.startsWith('/promoter/')) ||
              (item.path === '/establishment/dashboard' && 
                (location.pathname.startsWith('/establishment/') || location.pathname === '/establishment')) ||
              (item.path === '/promoter/dashboard' && 
                (location.pathname.startsWith('/promoter/') || location.pathname === '/promoter'));
            
            if ((item.label === 'Home' || item.label === 'Dashboard') && type === NavigationType.USER) {
              return (
                <HomeButton
                  key="home"
                  isActive={isActive}
                  onClick={handleHomeClick}
                  userType={currentUserType}
                />
              );
            }
            
            return (
              <NavItem
                key={item.path}
                item={item}
                isActive={isActive}
                onClick={(e) => handleProfileClick(item, e)}
                userType={currentUserType}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
