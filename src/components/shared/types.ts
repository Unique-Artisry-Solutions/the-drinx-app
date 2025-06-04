
// Standard component interfaces for Phase 8D standardization

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// Base component props that all components should support
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

// Standard loading state interface
export interface LoadingStateProps {
  isLoading?: boolean;
  loadingText?: string;
  loadingComponent?: ReactNode;
}

// Standard error state interface
export interface ErrorStateProps {
  error?: string | null;
  onRetry?: () => void;
  errorComponent?: ReactNode;
}

// Standard page configuration interface
export interface StandardPageConfig {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Standard action interface
export interface StandardAction {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
}

// Standard header props
export interface StandardHeaderProps extends BaseComponentProps {
  title: string;
  description?: string;
  actions?: StandardAction[];
}

// Standard content props
export interface StandardContentProps extends BaseComponentProps, LoadingStateProps, ErrorStateProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Standard layout props
export interface StandardLayoutProps extends BaseComponentProps {
  config: StandardPageConfig;
  actions?: StandardAction[];
  isLoading?: boolean;
  error?: string | null;
}

// Standard form field props
export interface StandardFormFieldProps extends BaseComponentProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Standard tab option interface
export interface StandardTabOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

// Standard navigation props - using handleTabChange for backward compatibility
export interface StandardNavigationProps extends BaseComponentProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: StandardTabOption[];
}
