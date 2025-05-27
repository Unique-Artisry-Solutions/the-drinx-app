
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { Home, Search, User, Settings, Bell, Calendar, MapPin, Users, BarChart3, Shield, Target, Route, UserCheck, DollarSign, Timer, TrendingUp, Mail } from 'lucide-react';

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
  },
  {
    label: 'Events',
    path: '/events',
    icon: Calendar
  },
  {
    label: 'Swig Circuits',
    path: '/swig-circuits',
    icon: Route
  },
  {
    label: 'Map',
    path: '/map',
    icon: MapPin
  },
  {
    label: 'Contact',
    path: '/contact',
    icon: Mail
  }
];

export const individualNavItems: UnifiedNavItem[] = [
  {
    label: 'Explore',
    path: '/explore',
    icon: Search
  },
  {
    label: 'Events',
    path: '/events',
    icon: Calendar
  },
  {
    label: 'Swig Circuits',
    path: '/swig-circuits',
    icon: Route
  },
  {
    label: 'Map',
    path: '/map',
    icon: MapPin
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
    label: 'Swig Circuits',
    path: '/promoter/create-swig-circuit',
    icon: Route
  },
  {
    label: 'Analytics',
    path: '/promoter/analytics',
    icon: BarChart3
  },
  {
    label: 'Marketing',
    path: '/promoter/marketing-analytics',
    icon: Target
  },
  {
    label: 'Pricing',
    path: '/promoter/pricing',
    icon: DollarSign
  },
  {
    label: 'Urgency',
    path: '/promoter/urgency',
    icon: Timer
  },
  {
    label: 'Real-Time',
    path: '/promoter/real-time-analytics',
    icon: TrendingUp
  },
  {
    label: 'Affiliates',
    path: '/promoter/affiliate',
    icon: UserCheck
  },
  {
    label: 'Settings',
    path: '/promoter/settings',
    icon: Settings
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
