
export interface PromotionFormProps {
  onSubmit: (data: PromotionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PromotionFormData>;
  isEditing?: boolean;
}

export interface PromotionFormData {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  startDate: Date;
  endDate: Date | null;
  validDays?: string[];
  usageLimit?: number | null;
  isActive: boolean;
  minPurchaseAmount?: number | null;
  combinable?: boolean;
}

export interface DayOption {
  label: string;
  value: string;
}

export const dayOptions: DayOption[] = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

export interface DiscountTypeOption {
  label: string;
  value: 'percentage' | 'fixed' | 'free_item';
  description: string;
}

export const discountTypeOptions: DiscountTypeOption[] = [
  { 
    label: 'Percentage', 
    value: 'percentage', 
    description: 'Discount as percentage of purchase' 
  },
  { 
    label: 'Fixed Amount', 
    value: 'fixed', 
    description: 'Fixed dollar amount discount' 
  },
  { 
    label: 'Free Item', 
    value: 'free_item', 
    description: 'Free item with purchase' 
  }
];

// Update the Promotion interface to match what's used in PromotionsTab
export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  usage_limit: number | null;
  usage_count: number;
  valid_days: string[] | null;
  valid_hours: { start: string; end: string; } | null;
  user_segment: string | null;
  combinable: boolean;
  min_purchase_amount: number | null;
}

// Add PromotionCode and PromotionAnalytics types for API functions
export interface PromotionCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  establishment_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  usage_limit: number | null;
  current_usage: number;
  min_purchase_amount: number | null;
  valid_days: string[] | null;
  valid_hours: { start: string; end: string; } | null;
  combinable: boolean;
  user_segment: string | null;
}

export interface PromotionAnalytics {
  promotion_id: string;
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  establishment_id: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  total_order_value: number;
  average_order_value: number;
  total_discount_amount: number;
  days_remaining: number;
  usage_percentage: number;
  total_redemptions: number;
  total_usage: number; // Add missing property
  total_revenue: number; // Add missing property
  conversion_rate: number; // Add missing property
}

// Add interface for audit logs
export interface PromotionAuditLog {
  id: string;
  promotion_id: string;
  user_id?: string;
  action_type: 'create' | 'update' | 'redeem' | 'delete' | 'validate' | 'automatic_apply' | 'batch_create';
  status: string;
  metadata?: Record<string, any>;
  created_at: string;
  ip_address?: string;
  details?: string;
}

export interface PromotionUsageAnalytics {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  redemption_count: number;
  unique_users: number;
  avg_purchase_amount?: number | null;
  total_discount_amount?: number | null;
  successful_validations: number;
  failed_validations: number;
  auto_applied_count: number;
}

export interface ResultOne {
  [key: string]: any;
}
