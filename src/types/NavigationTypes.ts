
/**
 * Central definition for navigation-related types
 */

export enum NavigationType {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
