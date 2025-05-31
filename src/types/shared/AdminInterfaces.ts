
// Shared admin interfaces to reduce duplication across admin components

import { BaseListItem, BaseStateProps, BaseListManagementProps, BaseTableColumn } from './BaseInterfaces';

// Base admin entity interface
export interface BaseAdminEntity extends BaseListItem {
  status: 'active' | 'inactive' | 'pending' | 'archived';
  metadata?: Record<string, any>;
}

// Generic admin table props
export interface BaseAdminTableProps<T extends BaseAdminEntity> extends BaseStateProps, BaseListManagementProps {
  items: T[];
  columns: BaseTableColumn<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  actions?: Array<{
    label: string;
    onClick: (item: T) => void;
    variant?: 'default' | 'destructive';
    icon?: any;
  }>;
}

// Base admin form props for CRUD operations
export interface BaseAdminFormProps<T extends BaseAdminEntity> {
  item?: T;
  mode: 'create' | 'edit' | 'view';
  onSave: (data: Partial<T>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Base admin filter interface
export interface BaseAdminFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
  label?: string;
}

// Base admin dashboard card props
export interface BaseAdminDashboardCard {
  title: string;
  description?: string;
  value: number | string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: any;
  actionLabel?: string;
  onActionClick?: () => void;
}

// Base system configuration interface
export interface BaseSystemConfig extends BaseAdminEntity {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  isPublic: boolean;
  isEditable: boolean;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

// Base analytics interface for admin components
export interface BaseAdminAnalytics {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: Array<{
    key: string;
    label: string;
    value: number;
    previousValue?: number;
    unit?: string;
    format?: 'number' | 'percentage' | 'currency' | 'duration';
  }>;
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'area';
    title: string;
    data: any[];
    config?: Record<string, any>;
  }>;
}
