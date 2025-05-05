
import { Home, Map, User, Route, Megaphone, BarChart2, Building, Bell, Calendar, Ticket } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NavItem } from './types';
import { Link } from 'react-router-dom';

export const getUserNavItems = (
  userType: 'individual' | 'establishment' | 'promoter', 
  getProfilePath: () => string
): NavItem[] => {
  const navItems: NavItem[] = [];
  
  // Add appropriate home path based on user type
  if (userType === 'establishment') {
    navItems.push({ icon: Home, label: 'Home', path: '/establishment/dashboard' });
    navItems.push({ icon: Bell, label: 'Notifications', path: '/establishment/notifications' });
  } else if (userType === 'promoter') {
    navItems.push({ icon: Home, label: 'Home', path: '/promoter/dashboard' });
    navItems.push({ icon: Bell, label: 'Notifications', path: '/promoter/notifications' });
  } else {
    navItems.push({ icon: Home, label: 'Explore', path: '/explore' });
    navItems.push({ icon: Bell, label: 'Notifications', path: '/notifications' });
  }
  
  // Add Map for all user types
  navItems.push({ icon: Map, label: 'Map', path: '/map' });
  
  // Add Create Dropdown for promoters only
  if (userType === 'promoter') {
    navItems.push({
      icon: Route,
      label: 'Create',
      path: '#',
      dropdown: {
        items: [
          { label: 'Event', path: '/promoter/events/create' },
          { label: 'Bar Crawl', path: '/create-bar-crawl' }
        ]
      }
    });
    navItems.push({ icon: Building, label: 'Venues', path: '/explore' });
    navItems.push({ icon: Calendar, label: 'Events', path: '/promoter/events' });
    navItems.push({ icon: Megaphone, label: 'Dashboard', path: '/promoter/dashboard' });
    navItems.push({ icon: BarChart2, label: 'Analytics', path: '/promoter/analytics' });
  } else {
    // Add My Tickets for individual users
    navItems.push({ icon: Ticket, label: 'My Tickets', path: '/profile/my-tickets' });
  }
  
  // Add Profile for all user types
  navItems.push({ icon: User, label: 'Profile', path: getProfilePath() });
  
  return navItems;
};
