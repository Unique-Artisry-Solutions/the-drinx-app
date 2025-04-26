
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import HomeButton from './HomeButton';
import NavItem from './NavItem';
import { NavItem as NavItemType } from './types';
import { NavigationType } from '../NavigationTypes';

interface NavigationBarProps {
  navItems: NavItemType[];
  type: NavigationType;
  handleHomeClick: (e: React.MouseEvent) => void;
  handleProfileClick: (item: NavItemType, e: React.MouseEvent) => void;
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

  const navBarClasses = theme === 'dark' 
    ? "fixed bottom-0 left-0 right-0 w-full bg-gray-900 shadow-lg z-50 md:hidden border-t border-gray-700 backdrop-blur-sm bg-gray-900/95 transition-all duration-300" 
    : currentUserType === 'promoter'
      ? "fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg z-50 md:hidden border-t border-purple-200 backdrop-blur-sm bg-white/95 transition-all duration-300"
      : "fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg z-50 md:hidden border-t border-gray-100 backdrop-blur-sm bg-white/95 transition-all duration-300";

  return (
    <nav className={navBarClasses}>
      <div className="mx-auto w-full">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = 
              location.pathname === item.path || 
              (item.path === '/profile' && location.pathname.startsWith('/profile/')) ||
              (item.path === '/establishment/dashboard' && 
                (location.pathname.startsWith('/establishment/') || location.pathname === '/establishment'));
            
            if (item.label === 'Home' && type === 'user') {
              return (
                <HomeButton
                  key="home"
                  isActive={isActive}
                  onClick={handleHomeClick}
                  isPromoter={currentUserType === 'promoter'}
                />
              );
            }
            
            return (
              <NavItem
                key={item.path}
                item={item}
                isActive={isActive}
                onClick={(e) => handleProfileClick(item, e)}
                isPromoter={currentUserType === 'promoter'}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
