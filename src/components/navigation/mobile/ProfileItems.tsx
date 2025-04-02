
import { Route, Star, CheckSquare } from 'lucide-react';
import { NavItem } from './types';

export const getProfileItems = (): NavItem[] => [
  { icon: Route, label: 'Bar Crawls', path: '/profile/bar-crawls' },
  { icon: Star, label: 'Favorites', path: '/profile/favorites' },
  { icon: CheckSquare, label: 'Visited', path: '/profile/visited' },
];
