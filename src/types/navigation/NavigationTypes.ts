
import { ReactNode } from 'react';

/**
 * Enum for different navigation types in the application
 */
export enum NavigationType {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

/**
 * Interface for navigation items used throughout the application
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
  children?: NavItem[];
}

/**
 * Interface for grouped navigation sections
 */
export interface NavSection {
  title?: string;
  items: NavItem[];
}

/**
 * User types for authentication and access control
 */
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';
