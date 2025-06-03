
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Enum for different navigation types in the application
 */
export enum NavigationType {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

/**
 * Standard unified navigation item interface used across the application
 */
export interface UnifiedNavItem {
  label: string;
  path: string;
  icon: LucideIcon; // Required field to match AdminNavItem
  isActive?: boolean;
  children?: UnifiedNavItem[];
  onClick?: (e: React.MouseEvent) => void;
  showInNav?: boolean;
  dropdown?: {
    items: {
      label: string;
      path: string;
    }[];
  };
}

// Define NavigationItem as an alias to UnifiedNavItem for NavigationContext
export type NavigationItem = UnifiedNavItem;

// Define AdminNavItem as an alias to UnifiedNavItem for compatibility
export type AdminNavItem = UnifiedNavItem;

// Export NavItem for use in ProfileItems
export type NavItem = UnifiedNavItem;

/**
 * Interface for grouped navigation sections
 */
export interface NavSection {
  title?: string;
  items: UnifiedNavItem[];
}

/**
 * User types for authentication and access control
 * Matches the auth context userType definition
 */
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

/**
 * Database role types that match the Supabase enum
 * Note: 'admin' is handled in auth logic but not part of the database enum
 */
export type DatabaseRole = 'individual' | 'establishment' | 'promoter';

/**
 * Breadcrumb item interface for navigation trails
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Configuration interface for navigation
 */
export interface NavigationConfig {
  enableBreadcrumbs?: boolean;
  enableActiveTabDetection?: boolean;
  customNavItems?: NavigationItem[];
}
