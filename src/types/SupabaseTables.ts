
// Custom type definitions for database tables that aren't in the auto-generated Supabase types

export interface UserVisitTable {
  id: string;
  user_id: string;
  establishment_id: string;
  visit_date: string;
  duration_minutes?: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface VisitNoteTable {
  id: string;
  visit_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface TriedMocktailTable {
  id: string;
  visit_id: string;
  cocktail_id: string;
  rating?: number;
  notes?: string;
  created_at: string;
}

export interface UserVisitAchievementTable {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_data: {
    establishment_id?: string;
    establishment_name?: string;
    count?: number;
    unique_count?: number;
  };
  earned_at: string;
  is_displayed: boolean;
}

export interface UserNotificationTable {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface UserVisitAnalyticsTable {
  user_id: string;
  total_visits: number;
  unique_establishments: number;
  average_rating: number;
  first_visit_date: string;
  last_visit_date: string;
  total_mocktails_tried: number;
  visited_establishments: string[];
}

// System configuration tables
export interface SystemSettingsTable {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  is_protected: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface SystemSettingsAuditLogTable {
  id: string;
  setting_key: string;
  old_value?: any;
  new_value: any;
  changed_by?: string;
  changed_at: string;
  change_reason?: string;
}

export interface EmailTemplateTable {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_updated_by?: string;
}

export interface ApiKeyConfigurationTable {
  id: string;
  service_name: string;
  api_key_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_verified_at?: string;
  metadata?: Record<string, any>;
}

export interface PaymentGatewayConfigTable {
  id: string;
  gateway_name: string;
  is_active: boolean;
  configuration: Record<string, any>;
  test_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureToggleTable {
  id: string;
  name: string;
  status: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Type definitions for the promotion system
export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number | null;
  start_date: string;
  end_date?: string | null;
  min_purchase?: number | null;
  max_discount?: number | null;
  usage_limit?: number | null;
  establishment_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  usage_count?: number;
}

export interface PromotionRedemption {
  id: string;
  promotion_id: string;
  user_id: string;
  order_id?: string;
  order_amount: number;
  discount_amount: number;
  redeemed_at: string;
  created_at: string;
}

export interface PromotionAnalytics {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  usage_limit?: number;
  total_redemptions: number;
  usage_percentage: number;
  average_order_value: number;
  total_order_value: number;
  total_discount_amount: number;
  days_remaining: number;
}

// System types for configuration management
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  is_protected: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface SystemSettingAuditLog {
  id: string;
  setting_key: string;
  old_value?: any;
  new_value: any;
  changed_by?: string;
  changed_at: string;
  change_reason?: string;
}

export interface SystemEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_updated_by?: string;
}

export interface ApiKeyConfiguration {
  id: string;
  service_name: string;
  api_key_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_verified_at?: string;
  metadata?: Record<string, any>;
}

export interface PaymentGatewayConfig {
  id: string;
  gateway_name: string;
  is_active: boolean;
  configuration: Record<string, any>;
  test_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureToggle {
  id: string;
  name: string;
  status: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}
