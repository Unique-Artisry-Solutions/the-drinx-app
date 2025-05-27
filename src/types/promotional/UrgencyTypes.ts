
// Urgency Features Types
export interface CountdownTimer {
  id: string;
  event_id?: string;
  swig_circuit_id?: string;
  timer_type: 'event_start' | 'sale_end' | 'early_bird' | 'flash_sale' | 'custom';
  title: string;
  description?: string;
  target_datetime: string;
  display_style: Record<string, any>;
  is_active: boolean;
  auto_hide_on_expiry: boolean;
  urgency_message?: string;
  created_at: string;
  updated_at: string;
}

export interface UrgencyCampaign {
  id: string;
  promoter_id: string;
  event_id?: string;
  swig_circuit_id?: string;
  campaign_name: string;
  campaign_type: 'limited_time' | 'limited_quantity' | 'early_bird' | 'last_chance' | 'flash_sale';
  message_template: string;
  display_conditions: Record<string, any>;
  trigger_conditions: Record<string, any>;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  max_displays?: number;
  current_displays: number;
  conversion_count: number;
  created_at: string;
  updated_at: string;
}

export interface ScarcityIndicator {
  id: string;
  urgency_campaign_id?: string;
  ticket_pricing_tier_id?: string;
  indicator_type: 'tickets_remaining' | 'percentage_sold' | 'high_demand' | 'almost_sold_out';
  threshold_value?: number;
  message_template: string;
  display_style: Record<string, any>;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface UrgencyAnalytics {
  campaign_performance: Array<{
    campaign_id: string;
    impressions: number;
    conversions: number;
    conversion_rate: number;
  }>;
  timer_effectiveness: Array<{
    timer_type: string;
    average_conversion_lift: number;
  }>;
  scarcity_impact: {
    tickets_sold_with_scarcity: number;
    conversion_rate_improvement: number;
  };
}
