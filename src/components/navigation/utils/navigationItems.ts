
import { NavigationType } from '@/types/navigation/NavigationTypes';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';

// This utility is now simplified since NavigationContext handles the logic
export const getNavItems = (
  type: NavigationType,
  currentUserType: 'individual' | 'establishment' | 'promoter',
  forceGuestNavigation: boolean,
  user: any,
  location: { pathname: string },
  getProfilePath: () => string
): UnifiedNavItem[] => {
  // This function is kept for backward compatibility
  // The actual navigation logic is now in NavigationContext
  // Mobile components should use NavigationContext directly
  return [];
};
