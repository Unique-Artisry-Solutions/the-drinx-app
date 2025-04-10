
import { Home, Map, User, Route } from 'lucide-react';
import { NavItem } from './types';

export const getUserNavItems = (
  userType: 'individual' | 'establishment' | 'promoter', 
  getProfilePath: () => string
): NavItem[] => {
  const navItems: NavItem[] = [];
  
  // Add appropriate home path based on user type
  if (userType === 'establishment') {
    navItems.push({ icon: Home, label: 'Home', path: '/establishment/dashboard' });
  } else if (userType === 'promoter') {
    navItems.push({ icon: Home, label: 'Home', path: '/promoter/dashboard' });
  } else {
    navItems.push({ icon: Home, label: 'Explore', path: '/explore' });
  }
  
  // Add Map for both user types
  navItems.push({ icon: Map, label: 'Map', path: '/map' });
  
  // Add Create for individuals only
  if (userType === 'individual') {
    navItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  }
  
  // Add Profile for both user types
  navItems.push({ icon: User, label: 'Profile', path: getProfilePath() });
  
  return navItems;
};
