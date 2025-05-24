
import { NavigationType } from '@/types/navigation/NavigationTypes';
import { UnifiedNavItem, NavigationItem, NavigationConfig, BreadcrumbItem, UserType } from '@/types/navigation';
import { 
  guestNavItems, 
  individualNavItems, 
  establishmentNavItems, 
  promoterNavItems, 
  adminNavItems 
} from '@/config/navigation';

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

/**
 * Generate navigation items based on user type and authentication status
 */
export const generateNavigationItems = (
  userType: UserType | null | undefined,
  isAuthenticated: boolean,
  navigationConfig?: NavigationConfig
): NavigationItem[] => {
  // Return custom nav items if provided
  if (navigationConfig?.customNavItems) {
    return navigationConfig.customNavItems;
  }

  // If not authenticated or no user type, return guest navigation
  if (!isAuthenticated || !userType) {
    return guestNavItems;
  }

  // Return navigation items based on user type
  switch (userType) {
    case 'individual':
      return individualNavItems;
    case 'establishment':
      return establishmentNavItems;
    case 'promoter':
      return promoterNavItems;
    case 'admin':
      return adminNavItems;
    default:
      return guestNavItems;
  }
};

/**
 * Generate breadcrumbs from current path and navigation items
 */
export const generateBreadcrumbs = (
  pathname: string,
  navigationItems: NavigationItem[]
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always start with Home
  breadcrumbs.push({ label: 'Home', href: '/' });
  
  // Find matching navigation item
  const currentItem = navigationItems.find(item => 
    pathname === item.path || pathname.startsWith(item.path + '/')
  );
  
  if (currentItem && currentItem.path !== '/') {
    breadcrumbs.push({ label: currentItem.label, href: currentItem.path });
    
    // Handle sub-paths
    if (pathname !== currentItem.path) {
      const remainingPath = pathname.replace(currentItem.path, '');
      const pathSegments = remainingPath.split('/').filter(Boolean);
      
      let currentPath = currentItem.path;
      pathSegments.forEach(segment => {
        currentPath += '/' + segment;
        const formattedLabel = segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ label: formattedLabel, href: currentPath });
      });
    }
  }
  
  return breadcrumbs;
};

/**
 * Get the active tab based on current path and navigation items
 */
export const getActiveTab = (
  pathname: string,
  navigationItems: NavigationItem[]
): string | null => {
  const activeItem = navigationItems.find(item => 
    pathname === item.path || pathname.startsWith(item.path + '/')
  );
  
  return activeItem ? activeItem.path : null;
};

/**
 * Check if a feature should be shown based on user type
 */
export const shouldShowFeature = (
  featureKey: string,
  userType: UserType | null | undefined
): boolean => {
  // Define feature visibility rules
  const featureRules: Record<string, UserType[]> = {
    'admin-only': ['admin'],
    'promoter-only': ['promoter'],
    'establishment-only': ['establishment'],
    'authenticated': ['individual', 'establishment', 'promoter', 'admin'],
    'public': ['individual', 'establishment', 'promoter', 'admin']
  };
  
  if (!userType) return false;
  
  const allowedUserTypes = featureRules[featureKey];
  return allowedUserTypes ? allowedUserTypes.includes(userType) : true;
};
