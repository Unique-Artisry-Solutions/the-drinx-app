
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { Home, Search, User, Settings, Bell, Calendar, MapPin, Users, BarChart3, Shield } from 'lucide-react';

export const guestNavItems: UnifiedNavItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: Home
  },
  {
    label: 'Explore',
    path: '/explore',
    icon: Search
  }
];

export const individualNavItems: UnifiedNavItem[] = [
  {
    label: 'Explore',
    path: '/explore',
    icon: Search
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: User
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell
  }
];

export const establishmentNavItems: UnifiedNavItem[] = [
  {
    label: 'Dashboard',
    path: '/establishment/dashboard',
    icon: BarChart3
  },
  {
    label: 'Profile',
    path: '/establishment/profile',
    icon: User
  },
  {
    label: 'Events',
    path: '/establishment/events',
    icon: Calendar
  }
];

export const promoterNavItems: UnifiedNavItem[] = [
  {
    label: 'Dashboard',
    path: '/promoter/dashboard',
    icon: BarChart3
  },
  {
    label: 'Events',
    path: '/promoter/events',
    icon: Calendar
  },
  {
    label: 'Profile',
    path: '/promoter/profile',
    icon: User
  }
];

export const adminNavItems: UnifiedNavItem[] = [
  {
    label: 'System',
    path: '/admin/system-breakdown',
    icon: Shield
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Users
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart3
  }
];
