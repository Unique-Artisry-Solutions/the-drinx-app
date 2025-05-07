export interface CampaignSegmentMapping {
  id: string;
  campaign_id: string;
  segment_id: string;
  allocation_percentage: number;
  is_control_group: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metrics: Record<string, any>;
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

// This interface aligns with the expected structure in AttendeeSegmentsTab
export interface SegmentSelection {
  id: string;
  name: string;
  allocation?: number;
  isControlGroup?: boolean;
  description?: string;
  segment_id?: string; // Added to accommodate existing usage
}

// Notification channel types for type safety
export type NotificationChannel = 'email' | 'in_app' | 'push';

// Priority levels for notifications
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Add the types that are being referenced
export type AudienceSegment = {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status?: string;
  memberCount?: number;
};

export type SegmentCriteria = {
  id: string;
  segment_id: string;
  criteria_type: string;
  criteria_value: any;
  operator: string;
  created_at: string;
  updated_at: string;
};

export type SegmentMapping = {
  id: string;
  segment_id: string;
  mapping_type: string;
  target_id: string;
  created_at: string;
  updated_at: string;
};

export type EventMarketingCampaign = {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  metrics: Record<string, any>;
  target_audience: Record<string, any>;
  event_id: string;
};
