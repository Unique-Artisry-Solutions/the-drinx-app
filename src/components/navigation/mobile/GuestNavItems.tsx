
import { Home, BookOpen, LogIn, UserPlus } from 'lucide-react';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';

export const getGuestNavItems = (): UnifiedNavItem[] => [
  { icon: Home, label: 'Home', path: '/landing' },
  { icon: BookOpen, label: 'Our Mission', path: '/mission' },
  { icon: LogIn, label: 'Login', path: '/login' },
  { icon: UserPlus, label: 'Sign Up', path: '/signup' },
];

export const getCartGuestNavItems = (): UnifiedNavItem[] => [
  { icon: Home, label: 'Home', path: '/landing' },
  { icon: BookOpen, label: 'Our Mission', path: '/mission' },
  { icon: LogIn, label: 'Login', path: '/login' },
];
