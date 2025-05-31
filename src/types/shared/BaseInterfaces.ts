
/**
 * Base interfaces for common component patterns across the application
 * 
 * Naming Conventions:
 * - Props: Component prop interfaces (e.g., BaseComponentProps)
 * - Data: Data transfer objects and API responses (e.g., BaseApiResponseData)
 * - Config: Configuration objects (e.g., BaseTableConfig)
 * - State: Component state interfaces (e.g., BaseLoadingState)
 */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// ===== COMPONENT PROPS =====
// Base component props that many components share
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
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

// Base navigation item props
export interface BaseNavItemProps {
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

// Base action button props
export interface BaseActionProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
}

// ===== STATE INTERFACES =====
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

// ===== DATA INTERFACES =====
// Base list item interface for any list component
export interface BaseListItemData {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Base user data interface
export interface BaseUserData extends BaseListItemData {
  email: string;
  avatar?: string;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin';
  isVerified?: boolean;
  lastActiveAt?: string;
}

// Base event data interface
export interface BaseEventData extends BaseListItemData {
  date: string;
  time?: string;
  location?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  imageUrl?: string;
}

// Generic API response data
export interface BaseApiResponseData<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Generic list response data
export interface BaseListResponseData<T = any> extends BaseApiResponseData<T[]> {
  pagination?: BasePaginationData;
}

// ===== CONFIG INTERFACES =====
// Base table column config
export interface BaseTableColumnConfig<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, item: T) => ReactNode;
}

// Base pagination config
export interface BasePaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

// Base search config
export interface BaseSearchConfig {
  searchTerm?: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

// Base sort config
export interface BaseSortConfig<T = string> {
  sortField?: T;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (field: T, order: 'asc' | 'desc') => void;
}

// Combined list management config
export interface BaseListManagementConfig<T = string> 
  extends BaseSearchConfig, BaseSortConfig<T>, BasePaginationConfig {}

// ===== SUPPORTING DATA TYPES =====
// Pagination data structure
export interface BasePaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

// Base analytics/metrics data
export interface BaseMetricsData {
  value: number | string;
  label: string;
  icon?: LucideIcon;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period?: string;
}

// Legacy exports for backward compatibility
/** @deprecated Use BaseNavItemProps instead */
export type BaseNavItem = BaseNavItemProps;
/** @deprecated Use BaseListItemData instead */
export type BaseListItem = BaseListItemData;
/** @deprecated Use BaseUserData instead */
export type BaseUser = BaseUserData;
/** @deprecated Use BaseEventData instead */
export type BaseEvent = BaseEventData;
/** @deprecated Use BaseTableColumnConfig instead */
export type BaseTableColumn<T = any> = BaseTableColumnConfig<T>;
/** @deprecated Use BasePaginationConfig instead */
export type BasePaginationProps = BasePaginationConfig;
/** @deprecated Use BaseSearchConfig instead */
export type BaseSearchProps = BaseSearchConfig;
/** @deprecated Use BaseSortConfig instead */
export type BaseSortProps<T = string> = BaseSortConfig<T>;
/** @deprecated Use BaseListManagementConfig instead */
export type BaseListManagementProps<T = string> = BaseListManagementConfig<T>;
/** @deprecated Use BaseApiResponseData instead */
export type BaseApiResponse<T = any> = BaseApiResponseData<T>;
/** @deprecated Use BaseListResponseData instead */
export type BaseListResponse<T = any> = BaseListResponseData<T>;
/** @deprecated Use BaseMetricsData instead */
export type BaseMetrics = BaseMetricsData;
