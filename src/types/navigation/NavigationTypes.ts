
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
  icon?: LucideIcon;
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

/**
 * Interface for grouped navigation sections
 */
export interface NavSection {
  title?: string;
  items: UnifiedNavItem[];
}

/**
 * User types for authentication and access control
 */
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';
