
// Dynamic Pricing System Types
export interface PricingRule {
  id: string;
  promoter_id: string;
  event_id?: string;
  swig_circuit_id?: string;
  rule_name: string;
  rule_type: 'time_based' | 'demand_based' | 'inventory_based' | 'combined';
  conditions: Record<string, any>;
  price_adjustment_type: 'percentage' | 'fixed';
  price_adjustment_value: number;
  min_price?: number;
  max_price?: number;
  priority: number;
  is_active: boolean;
  effective_from: string;
  effective_until?: string;
  created_at: string;
  updated_at: string;
}

export interface DemandMetrics {
  id: string;
  event_id?: string;
  swig_circuit_id?: string;
  metric_date: string;
  page_views: number;
  unique_visitors: number;
  ticket_inquiries: number;
  cart_additions: number;
  cart_abandonments: number;
  sales_velocity: number;
  demand_score: number;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  pricing_tier_id?: string;
  old_price: number;
  new_price: number;
  change_reason: string;
  rule_applied?: string;
  changed_by?: string;
  automatic_change: boolean;
  effective_at: string;
  created_at: string;
}

export interface PricingAutomation {
  id: string;
  pricing_rule_id: string;
  trigger_conditions: Record<string, any>;
  last_triggered?: string;
  trigger_count: number;
  is_active: boolean;
  cooldown_minutes: number;
  max_triggers_per_day: number;
  created_at: string;
  updated_at: string;
}

export interface PricingAnalytics {
  revenue_impact: number;
  price_adjustments_count: number;
  average_demand_score: number;
  conversion_rate_change: number;
  most_effective_rules: PricingRule[];
}
