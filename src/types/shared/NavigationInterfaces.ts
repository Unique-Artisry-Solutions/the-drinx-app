
/**
 * Navigation interfaces to consolidate navigation component props
 * 
 * Naming Conventions:
 * - Props: Component prop interfaces for navigation components
 * - Data: Navigation data structures and item definitions
 * - Config: Navigation configuration objects
 */

import { LucideIcon } from 'lucide-react';
import { BaseNavItemProps, BaseComponentProps } from './BaseInterfaces';

// ===== NAVIGATION DATA =====
// Enhanced navigation item data with dropdown support
export interface EnhancedNavItemData extends BaseNavItemProps {
  dropdown?: NavDropdownItemData[];
  isExternal?: boolean;
  requiresAuth?: boolean;
  userTypes?: ('individual' | 'establishment' | 'promoter' | 'admin')[];
}

// Navigation dropdown item data
export interface NavDropdownItemData {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

// Navigation section data for grouped items
export interface NavigationSectionData {
  id: string;
  title?: string;
  items: EnhancedNavItemData[];
  isCollapsible?: boolean;
  isExpanded?: boolean;
}

// Breadcrumb item data
export interface BreadcrumbItemData {
  label: string;
  path?: string;
  isActive?: boolean;
}

// Tab navigation item data
export interface TabNavigationItemData {
  id: string;
  label: string;
  content?: React.ReactNode;
  isDisabled?: boolean;
  badge?: string | number;
}

// ===== NAVIGATION PROPS =====
// Base navigation container props
export interface BaseNavigationProps extends BaseComponentProps {
  items: EnhancedNavItemData[];
  currentPath?: string;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
  onItemClick?: (item: EnhancedNavItemData, e: React.MouseEvent) => void;
}

// Mobile navigation specific props
export interface MobileNavigationProps extends BaseNavigationProps {
  variant: 'bottom' | 'side' | 'overlay';
  isOpen?: boolean;
  onToggle?: () => void;
}

// Desktop navigation specific props
export interface DesktopNavigationProps extends BaseNavigationProps {
  variant: 'top' | 'side';
  isCollapsed?: boolean;
  onCollapseToggle?: () => void;
}

// Breadcrumb navigation props
export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItemData[];
  separator?: string;
  maxItems?: number;
}

// Tab navigation props
export interface TabNavigationProps extends BaseComponentProps {
  tabs: TabNavigationItemData[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

// Legacy exports for backward compatibility
/** @deprecated Use EnhancedNavItemData instead */
export type EnhancedNavItem = EnhancedNavItemData;
/** @deprecated Use NavDropdownItemData instead */
export type NavDropdownItem = NavDropdownItemData;
/** @deprecated Use NavigationSectionData instead */
export type NavigationSection = NavigationSectionData;
