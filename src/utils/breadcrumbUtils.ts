
import { UserType } from '@/types/navigation/NavigationTypes';

/**
 * Get the appropriate home path based on user type
 */
export const getHomePathByUserType = (userType: UserType | null, isAuthenticated: boolean): string => {
  if (!isAuthenticated || !userType) {
    return '/landing';
  }
  
  switch (userType) {
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter'; // Changed from '/promoter/dashboard' to '/promoter'
    case 'admin':
      return '/admin/system-breakdown';
    case 'individual':
      return '/explore';
    default:
      return '/landing';
  }
};

/**
 * Get the appropriate home label based on user type
 */
export const getHomeLabelByUserType = (userType: UserType | null, isAuthenticated: boolean): string => {
  if (!isAuthenticated || !userType) {
    return 'Home';
  }
  
  switch (userType) {
    case 'establishment':
    case 'promoter':
    case 'admin':
      return 'Dashboard';
    case 'individual':
      return 'Explore';
    default:
      return 'Home';
  }
};
