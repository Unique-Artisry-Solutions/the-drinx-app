
// Shared navigation interfaces to consolidate navigation component props

import { LucideIcon } from 'lucide-react';
import { BaseNavItem, BaseComponentProps } from './BaseInterfaces';

// Enhanced navigation item with dropdown support
export interface EnhancedNavItem extends BaseNavItem {
  dropdown?: NavDropdownItem[];
  isExternal?: boolean;
  requiresAuth?: boolean;
  userTypes?: ('individual' | 'establishment' | 'promoter' | 'admin')[];
}

// Navigation dropdown item
export interface NavDropdownItem {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

// Base navigation container props
export interface BaseNavigationProps extends BaseComponentProps {
  items: EnhancedNavItem[];
  currentPath?: string;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
  onItemClick?: (item: EnhancedNavItem, e: React.MouseEvent) => void;
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

// Navigation section for grouped items
export interface NavigationSection {
  id: string;
  title?: string;
  items: EnhancedNavItem[];
  isCollapsible?: boolean;
  isExpanded?: boolean;
}

// Breadcrumb navigation props
export interface BreadcrumbProps extends BaseComponentProps {
  items: Array<{
    label: string;
    path?: string;
    isActive?: boolean;
  }>;
  separator?: string;
  maxItems?: number;
}

// Tab navigation props
export interface TabNavigationProps extends BaseComponentProps {
  tabs: Array<{
    id: string;
    label: string;
    content?: React.ReactNode;
    isDisabled?: boolean;
    badge?: string | number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}
