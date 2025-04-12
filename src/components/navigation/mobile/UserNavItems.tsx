
import { Home, Map, User, Route, Megaphone, BarChart2 } from 'lucide-react';
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
  
  // Add Map for all user types
  navItems.push({ icon: Map, label: 'Map', path: '/map' });
  
  // Add Create for promoters only (removed for individual users)
  if (userType === 'promoter') {
    navItems.push({ icon: Route, label: 'Create', path: '/create-bar-crawl' });
  }
  
  // Add Promotions for promoters only
  if (userType === 'promoter') {
    navItems.push({ icon: Megaphone, label: 'Promotions', path: '/promoter/dashboard' });
    navItems.push({ icon: BarChart2, label: 'Analytics', path: '/promoter/analytics' });
  }
  
  // Add Profile for all user types
  navItems.push({ icon: User, label: 'Profile', path: getProfilePath() });
  
  return navItems;
};
