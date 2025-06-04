
// Enhanced Standard Types - Phase 9E
// Strict type definitions for all components

import { ReactNode, ComponentProps } from 'react';
import { LucideIcon } from 'lucide-react';

// Base props that ALL components must extend from
export interface StrictBaseProps {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly 'data-testid'?: string;
  readonly id?: string;
}

// Strict loading states
export interface StrictLoadingState {
  readonly isLoading: boolean;
  readonly loadingText?: string;
  readonly loadingComponent?: ReactNode;
}

// Strict error states with required handlers
export interface StrictErrorState {
  readonly error: string | null;
  readonly onRetry: () => void;
  readonly errorComponent?: ReactNode;
}

// Enhanced action interface with strict typing
export interface StrictAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly onClick: () => void | Promise<void>;
  readonly variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly tooltip?: string;
}

// Strict form field interface
export interface StrictFormField {
  readonly name: string;
  readonly label: string;
  readonly type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  readonly placeholder?: string;
  readonly required: boolean;
  readonly disabled?: boolean;
  readonly validation?: {
    readonly min?: number;
    readonly max?: number;
    readonly pattern?: RegExp;
    readonly custom?: (value: any) => string | null;
  };
}

// Enhanced component state management
export interface StrictComponentState<T = any> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly lastUpdated: Date | null;
}

// Strict event handlers
export interface StrictEventHandlers {
  readonly onClick?: (event: React.MouseEvent) => void;
  readonly onSubmit?: (event: React.FormEvent) => void;
  readonly onChange?: (value: any) => void;
  readonly onFocus?: (event: React.FocusEvent) => void;
  readonly onBlur?: (event: React.FocusEvent) => void;
}

// Enhanced navigation props with strict typing
export interface StrictNavigationProps {
  readonly activeTab: string;
  readonly onTabChange: (tab: string) => void;
  readonly tabs: readonly StrictTabOption[];
  readonly orientation?: 'horizontal' | 'vertical';
}

export interface StrictTabOption {
  readonly id: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly disabled?: boolean;
  readonly badge?: string | number;
}

// Type-safe configuration interfaces
export interface StrictPageConfig {
  readonly title: string;
  readonly description?: string;
  readonly showBreadcrumbs: boolean;
  readonly maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  readonly padding: 'none' | 'sm' | 'md' | 'lg';
  readonly enableSearch?: boolean;
  readonly enableFilters?: boolean;
}

// Generic list component props
export interface StrictListProps<T> extends StrictBaseProps {
  readonly items: readonly T[];
  readonly renderItem: (item: T, index: number) => ReactNode;
  readonly keyExtractor: (item: T) => string;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly emptyState?: ReactNode;
}

// Enhanced form props
export interface StrictFormProps extends StrictBaseProps {
  readonly fields: readonly StrictFormField[];
  readonly onSubmit: (data: Record<string, any>) => Promise<void>;
  readonly initialValues?: Record<string, any>;
  readonly validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  readonly disabled?: boolean;
}
