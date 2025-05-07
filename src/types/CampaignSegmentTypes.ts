
export interface CampaignSegmentMapping {
  id: string;
  campaign_id: string;
  segment_id: string;
  allocation_percentage: number;
  is_control_group: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metrics?: Record<string, any>;
  description?: string;
}

export interface CampaignSegmentPerformance {
  id: string;
  campaign_id: string;
  segment_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  conversion_value: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignSegmentAnalytics {
  campaign_id: string;
  segment_id: string;
  segment_name: string;
  campaign_name: string;
  campaign_type: string;
  status: string;
  allocation_percentage: number;
  is_control_group: boolean;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_conversion_value: number;
  click_through_rate: number;
  conversion_rate: number;
}

export type InteractionType = 'impression' | 'click' | 'conversion';
