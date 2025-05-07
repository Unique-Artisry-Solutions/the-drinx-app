
import { Route, Star, CheckSquare } from 'lucide-react';
import { NavItem } from '@/types/navigation/NavigationTypes';

export const getProfileItems = (): NavItem[] => [
  { icon: Route, label: 'Swig Circuits', path: '/profile/bar-crawls' },
  { icon: Star, label: 'Favorites', path: '/profile/favorites' },
  { icon: CheckSquare, label: 'Visited', path: '/profile/visited' },
];
