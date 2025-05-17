// Define the type for JSON values (similar to Supabase's Json type)
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  establishment_id: string;
  user_segment?: string | null;
  usage_limit?: number | null;
  used_count?: number | null;  // Standardized to used_count across the app
  min_purchase_amount?: number | null;
  combinable: boolean;
  valid_days?: string[] | null;
  valid_hours?: {
    start: string;
    end: string;
  } | null | Json;
  created_at: string;
  updated_at: string;
}

// Ensure PromotionCode matches the structure of database responses
export interface PromotionCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  establishment_id: string;
  user_segment?: string | null;
  usage_limit?: number | null;
  min_purchase_amount?: number | null;
  combinable: boolean;
  valid_days?: string[] | null;
  valid_hours?: {
    start: string;
    end: string;
  } | null | Json;
  created_at: string;
  updated_at: string;
  used_count?: number | null;  // Standardized to used_count across the app
}

export interface PromotionAnalytics {
  id: string;
  promotion_id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  redemption_count: number;
  unique_users: number;
  avg_purchase_amount: number;
  total_discount_amount: number;
  successful_validations: number;
  failed_validations: number;
  auto_applied_count: number;
  total_usage: number;
  total_revenue: number;
  conversion_rate: number;
}

export interface PromotionAuditLog {
  id: string;
  promotion_id: string;
  action_type: 'create' | 'update' | 'delete' | 'redeem' | 'validate' | 'expire';
  status: 'success' | 'failure' | 'pending';
  created_at: string;
  metadata?: Record<string, any>;
  user_id?: string;
  details?: string;
}

export interface PromotionUsageAnalytics {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  establishment_id: string;
  redemption_count: number;
  unique_users: number;
  avg_purchase_amount: number;
  total_discount_amount: number;
  successful_validations: number;
  failed_validations: number;
  auto_applied_count: number;
}

// Type for form data when creating or editing a promotion
export interface PromotionFormData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string | Date;
  end_date?: string | Date | null;
  is_active: boolean;
  establishment_id?: string;
  user_segment?: string;
  usage_limit?: number | null;
  min_purchase_amount?: number | null;
  combinable: boolean;
  valid_days?: string[];
  valid_hours?: {
    start: string;
    end: string;
  };
}

// Type for API parameters
export interface CreatePromotionCodeParams {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  usage_limit?: number | null;
  valid_days?: string[] | null;
  min_purchase_amount?: number | null;
  combinable?: boolean;
}

export interface BatchCreateParams {
  codes: CreatePromotionCodeParams[];
  establishment_id: string;
}
