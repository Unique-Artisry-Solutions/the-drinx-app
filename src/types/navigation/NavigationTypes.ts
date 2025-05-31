
// Updated navigation types using shared base interfaces
import { EnhancedNavItem, NavDropdownItem, BaseNavigationProps } from '../shared/NavigationInterfaces';

// Re-export the enhanced types for backward compatibility
export type UnifiedNavItem = EnhancedNavItem;
export type { NavDropdownItem };

// Navigation type enum
export enum NavigationType {
  USER = 'user',
  ADMIN = 'admin',
  GUEST = 'guest'
}

// Legacy type for backward compatibility
export type NavigationItemType = EnhancedNavItem;

// Specific navigation configurations
export interface UserNavigationConfig extends BaseNavigationProps {
  type: NavigationType.USER;
  userType: 'individual' | 'establishment' | 'promoter';
}

export interface AdminNavigationConfig extends BaseNavigationProps {
  type: NavigationType.ADMIN;
  userType: 'admin';
}

export interface GuestNavigationConfig extends BaseNavigationProps {
  type: NavigationType.GUEST;
}

export type NavigationConfig = UserNavigationConfig | AdminNavigationConfig | GuestNavigationConfig;
