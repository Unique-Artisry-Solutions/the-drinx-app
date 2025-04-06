
import { Home, BookOpen, LogIn, UserPlus } from 'lucide-react';
import { NavItem } from './types';

export const getGuestNavItems = (): NavItem[] => [
  { icon: Home, label: 'Home', path: '/landing' },
  { icon: BookOpen, label: 'Our Mission', path: '/mission' },
  { icon: LogIn, label: 'Login', path: '/login' },
  { icon: UserPlus, label: 'Sign Up', path: '/signup' },
];

export const getCartGuestNavItems = (): NavItem[] => [
  { icon: Home, label: 'Home', path: '/landing' },
  { icon: BookOpen, label: 'Our Mission', path: '/mission' },
  { icon: LogIn, label: 'Login', path: '/login' },
];

