
/**
 * Navigation types using shared base interfaces with consistent naming conventions
 * 
 * Namespace: Navigation
 * Naming Conventions Applied:
 * - Props: Component interfaces
 * - Data: Data structures  
 * - Config: Configuration objects
 */

import { EnhancedNavItemData, NavDropdownItemData, BaseNavigationProps } from '../shared/NavigationInterfaces';

// ===== NAVIGATION TYPE DEFINITIONS =====
// Navigation type enum
export enum NavigationType {
  USER = 'user',
  ADMIN = 'admin',
  GUEST = 'guest'
}

// User type definition for consistent typing
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

// ===== NAVIGATION CONFIG =====
// Specific navigation configurations with proper naming
export interface UserNavigationConfig extends BaseNavigationProps {
  type: NavigationType.USER;
  userType: UserType;
}

export interface AdminNavigationConfig extends BaseNavigationProps {
  type: NavigationType.ADMIN;
  userType: 'admin';
}

export interface GuestNavigationConfig extends BaseNavigationProps {
  type: NavigationType.GUEST;
}

// Union type for all navigation configurations
export type NavigationConfig = UserNavigationConfig | AdminNavigationConfig | GuestNavigationConfig;

// ===== LEGACY COMPATIBILITY =====
// Re-export the enhanced types for backward compatibility
/** @deprecated Use EnhancedNavItemData instead */
export type UnifiedNavItem = EnhancedNavItemData;
/** @deprecated Use EnhancedNavItemData instead */
export type NavigationItemType = EnhancedNavItemData;

// Re-export shared types
export type { NavDropdownItemData as NavDropdownItem };
