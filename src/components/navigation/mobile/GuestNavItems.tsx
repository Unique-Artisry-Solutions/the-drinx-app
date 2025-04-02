
import { Home, ShoppingCart, User } from 'lucide-react';
import { NavItem } from './types';

export const getGuestNavItems = (): NavItem[] => [
  { icon: Home, label: 'Home', path: '/landing' },
  { icon: ShoppingCart, label: 'Cart', path: '/cart' },
  { icon: User, label: 'Login', path: '/login' },
];
