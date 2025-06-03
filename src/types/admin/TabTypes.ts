
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface AdminTabConfig {
  value: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  content?: ReactNode;
}

export interface AdminTabGroup {
  id: string;
  label?: string;
  tabs: AdminTabConfig[];
}

export interface ResponsiveTabBehavior {
  mobile: 'dropdown' | 'carousel' | 'stacked';
  tablet: 'scrollable' | 'wrapped' | 'dropdown';
  desktop: 'horizontal' | 'split' | 'sidebar';
}

export interface AdminTabConfiguration {
  id: string;
  name: string;
  groups: {
    primary: AdminTabConfig[];
    secondary?: AdminTabConfig[];
  };
  responsive: ResponsiveTabBehavior;
  persistence?: {
    key: string;
    defaultTab: string;
  };
  className?: string;
}

export interface UseAdminTabsState {
  activeTab: string;
  previousTab: string | null;
  isMobile: boolean;
  isTablet: boolean;
  isOverflowing: boolean;
}

export interface UseAdminTabsActions {
  setActiveTab: (tabValue: string) => void;
  goToPreviousTab: () => void;
  resetToDefault: () => void;
  validateTab: (tabValue: string) => boolean;
}
