
import { Home, Map, Plus, User } from 'lucide-react';
import { NavItem } from './types';

export const getAdminNavItems = (): NavItem[] => [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: Plus, label: 'Add', path: '/add' },
  { icon: User, label: 'Admin', path: '/admin' },
];
