
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
 * Note: 'admin' is handled in the auth logic but not part of the database enum
 */
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

/**
 * Database role types that match the Supabase enum
 */
export type DatabaseRole = 'individual' | 'establishment' | 'promoter';
