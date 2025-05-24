
import { useState, useMemo } from 'react';
import { NavigationType } from '@/types/navigation/NavigationTypes';

export const useMobileNavigation = (
  type: NavigationType,
  userType: 'individual' | 'establishment' | 'promoter' | 'admin',
  forceGuestNavigation: boolean = false
) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  const getProfilePath = useMemo(() => {
    return () => {
      switch (userType) {
        case 'establishment':
          return '/establishment/profile';
        case 'promoter':
          return '/promoter/profile';
        case 'admin':
          return '/admin/profile';
        case 'individual':
        default:
          return '/profile';
      }
    };
  }, [userType]);

  return {
    expanded,
    toggleExpand,
    getProfilePath: getProfilePath(),
  };
};
