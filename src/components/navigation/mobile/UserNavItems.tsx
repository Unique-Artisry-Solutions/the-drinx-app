
import { Home, Map, User, Route, Megaphone, BarChart2, Building, Bell, Calendar, Ticket, Users, ChartBar } from 'lucide-react';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';

export const getUserNavItems = (
  userType: 'individual' | 'establishment' | 'promoter', 
  getProfilePath: () => string
): UnifiedNavItem[] => {
  const navItems: UnifiedNavItem[] = [];
  
  // Add appropriate home/dashboard path based on user type
  if (userType === 'establishment') {
    navItems.push({ icon: Building, label: 'Dashboard', path: '/establishment/dashboard' });
    navItems.push({ icon: Calendar, label: 'Events', path: '/establishment/events' });
    navItems.push({ icon: ChartBar, label: 'Analytics', path: '/establishment/analytics' });
    navItems.push({ icon: Bell, label: 'Notifications', path: '/establishment/notifications' });
  } else if (userType === 'promoter') {
    navItems.push({ icon: Megaphone, label: 'Dashboard', path: '/promoter/dashboard' });
    navItems.push({ icon: Calendar, label: 'Events', path: '/promoter/events' });
    navItems.push({ icon: ChartBar, label: 'Analytics', path: '/promoter/analytics' });
    navItems.push({ icon: Bell, label: 'Notifications', path: '/promoter/notifications' });
  } else {
    navItems.push({ icon: Home, label: 'Explore', path: '/explore' });
    navItems.push({ icon: Map, label: 'Map', path: '/map' });
    navItems.push({ icon: Ticket, label: 'My Tickets', path: '/profile/my-tickets' });
    navItems.push({ icon: Bell, label: 'Notifications', path: '/notifications' });
  }
  
  // Add Profile for all user types
  navItems.push({ icon: User, label: 'Profile', path: getProfilePath() });
  
  return navItems;
};
