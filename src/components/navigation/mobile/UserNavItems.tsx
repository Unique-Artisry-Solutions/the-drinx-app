
import { Home, Map, User, Route } from 'lucide-react';
import { NavItem } from './types';

export const getUserNavItems = (
  userType: 'individual' | 'establishment', 
  getProfilePath: () => string
): NavItem[] => {
  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
  ];
  
  // Add Create for individuals only
  if (userType === 'individual') {
    navItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  }
  
  navItems.push({ icon: User, label: 'Profile', path: getProfilePath() });
  
  return navItems;
};
