
/**
 * Admin interfaces to reduce duplication across admin components
 * 
 * Naming Conventions:
 * - Props: Component prop interfaces for admin components
 * - Data: Data structures for admin entities and responses
 * - Config: Configuration objects for admin functionality
 */

import { BaseListItemData, BaseStateProps, BaseListManagementConfig, BaseTableColumnConfig } from './BaseInterfaces';

// ===== ADMIN DATA =====
// Base admin entity data interface
export interface BaseAdminEntityData extends BaseListItemData {
  status: 'active' | 'inactive' | 'pending' | 'archived';
  metadata?: Record<string, any>;
}

// Base system configuration data
export interface BaseSystemConfigData extends BaseAdminEntityData {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  isPublic: boolean;
  isEditable: boolean;
  validation?: BaseSystemConfigValidationData;
}

// System config validation data structure
export interface BaseSystemConfigValidationData {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
}

// Base analytics data for admin components
export interface BaseAdminAnalyticsData {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: BaseAdminMetricData[];
  charts?: BaseAdminChartData[];
}

// Admin metric data structure
export interface BaseAdminMetricData {
  key: string;
  label: string;
  value: number;
  previousValue?: number;
  unit?: string;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
}

// Admin chart data structure
export interface BaseAdminChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: any[];
  config?: Record<string, any>;
}

// ===== ADMIN PROPS =====
// Generic admin table props
export interface BaseAdminTableProps<T extends BaseAdminEntityData> 
  extends BaseStateProps, BaseListManagementConfig {
  items: T[];
  columns: BaseTableColumnConfig<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  actions?: BaseAdminTableActionConfig<T>[];
}

// Admin table action configuration
export interface BaseAdminTableActionConfig<T extends BaseAdminEntityData> {
  label: string;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  icon?: any;
}

// Base admin form props for CRUD operations
export interface BaseAdminFormProps<T extends BaseAdminEntityData> {
  item?: T;
  mode: 'create' | 'edit' | 'view';
  onSave: (data: Partial<T>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Base admin dashboard card props
export interface BaseAdminDashboardCardProps {
  title: string;
  description?: string;
  value: number | string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: any;
  actionLabel?: string;
  onActionClick?: () => void;
}

// ===== ADMIN CONFIG =====
// Base admin filter configuration
export interface BaseAdminFilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
  label?: string;
}

// Legacy exports for backward compatibility
/** @deprecated Use BaseAdminEntityData instead */
export type BaseAdminEntity = BaseAdminEntityData;
/** @deprecated Use BaseAdminFilterConfig instead */
export type BaseAdminFilter = BaseAdminFilterConfig;
/** @deprecated Use BaseAdminDashboardCardProps instead */
export type BaseAdminDashboardCard = BaseAdminDashboardCardProps;
/** @deprecated Use BaseSystemConfigData instead */
export type BaseSystemConfig = BaseSystemConfigData;
/** @deprecated Use BaseAdminAnalyticsData instead */
export type BaseAdminAnalytics = BaseAdminAnalyticsData;
