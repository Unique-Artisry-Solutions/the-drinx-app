
// Base interfaces for common component patterns across the application

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// Base component props that many components share
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

// Base loading state interface
export interface BaseLoadingState {
  isLoading?: boolean;
  loadingText?: string;
}

// Base error state interface
export interface BaseErrorState {
  error?: string | Error | null;
  onRetry?: () => void;
}

// Combined base state interface
export interface BaseStateProps extends BaseLoadingState, BaseErrorState {}

// Base list item interface for any list component
export interface BaseListItem {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Base card component props
export interface BaseCardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
}

// Base form field props
export interface BaseFormFieldProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

// Base navigation item interface
export interface BaseNavItem {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
  isActive?: boolean;
  badge?: string | number;
  onClick?: (e: React.MouseEvent) => void;
}

// Base modal/dialog props
export interface BaseModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

// Base table column interface
export interface BaseTableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, item: T) => ReactNode;
}

// Base pagination interface
export interface BasePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

// Base search/filter interface
export interface BaseSearchProps {
  searchTerm?: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

// Base sort interface
export interface BaseSortProps<T = string> {
  sortField?: T;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (field: T, order: 'asc' | 'desc') => void;
}

// Combined list management props
export interface BaseListManagementProps<T = string> extends BaseSearchProps, BaseSortProps<T>, BasePaginationProps {}

// Base action button props
export interface BaseActionProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
}

// Generic API response interface
export interface BaseApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Generic list response interface
export interface BaseListResponse<T = any> extends BaseApiResponse<T[]> {
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

// Base user interface for any user type
export interface BaseUser extends BaseListItem {
  email: string;
  avatar?: string;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin';
  isVerified?: boolean;
  lastActiveAt?: string;
}

// Base event interface
export interface BaseEvent extends BaseListItem {
  date: string;
  time?: string;
  location?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  imageUrl?: string;
}

// Base analytics/metrics interface
export interface BaseMetrics {
  value: number | string;
  label: string;
  icon?: LucideIcon;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period?: string;
}
