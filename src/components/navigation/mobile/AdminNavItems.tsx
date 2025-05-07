
import { Home, Map, Plus, User } from 'lucide-react';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';

export const getAdminNavItems = (): UnifiedNavItem[] => [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: Plus, label: 'Add', path: '/add' },
  { icon: User, label: 'Admin', path: '/admin' },
];
