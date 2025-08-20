
import { UserType } from '@/types/navigation/NavigationTypes';

/**
 * Get the appropriate home path based on user type, considering impersonation
 */
export const getHomePathByUserType = (
  userType: UserType | null, 
  isAuthenticated: boolean,
  isImpersonating?: boolean,
  impersonatedUserType?: UserType | null
): string => {
  // Use impersonated user type if impersonating
  const effectiveUserType = isImpersonating && impersonatedUserType ? impersonatedUserType : userType;
  const effectiveIsAuthenticated = isImpersonating ? true : isAuthenticated;
  
  if (!effectiveIsAuthenticated || !effectiveUserType) {
    return '/landing';
  }
  
  switch (effectiveUserType) {
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
 * Get the appropriate home label based on user type, considering impersonation
 */
export const getHomeLabelByUserType = (
  userType: UserType | null, 
  isAuthenticated: boolean,
  isImpersonating?: boolean,
  impersonatedUserType?: UserType | null
): string => {
  // Use impersonated user type if impersonating
  const effectiveUserType = isImpersonating && impersonatedUserType ? impersonatedUserType : userType;
  const effectiveIsAuthenticated = isImpersonating ? true : isAuthenticated;
  
  if (!effectiveIsAuthenticated || !effectiveUserType) {
    return 'Home';
  }
  
  switch (effectiveUserType) {
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
