
import { Home, MapPin, Search, User, Calendar, Route } from 'lucide-react';
import { UnifiedNavItem, UserType } from '@/types/navigation/NavigationTypes';

export const getUserNavItems = (userType: UserType): UnifiedNavItem[] => {
  const baseItems: UnifiedNavItem[] = [
    { icon: Home, label: 'Home', path: '/explore' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: MapPin, label: 'Map', path: '/map' },
  ];

  switch (userType) {
    case 'establishment':
      return [
        { icon: Home, label: 'Dashboard', path: '/establishment/dashboard' },
        { icon: Calendar, label: 'Events', path: '/establishment/events' },
        { icon: Route, label: 'Circuits', path: '/establishment/circuits' },
        { icon: User, label: 'Profile', path: '/establishment/profile' },
      ];
    
    case 'promoter':
      return [
        { icon: Home, label: 'Dashboard', path: '/promoter/dashboard' },
        { icon: Calendar, label: 'Events', path: '/promoter/events' },
        { icon: Route, label: 'Circuits', path: '/promoter/circuits' },
        { icon: User, label: 'Profile', path: '/promoter/profile' },
      ];
    
    case 'individual':
    default:
      return [
        ...baseItems,
        { icon: User, label: 'Profile', path: '/profile' },
      ];
  }
};
