
import { audience_filter_operator, audience_segment_status } from "@/integrations/supabase/types";

export type AudienceSegment = {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status?: audience_segment_status;
  memberCount?: number;
};

export type AudienceSegmentCriteria = {
  id: string;
  segment_id: string;
  criteria_type: string;
  criteria_value: any;
  operator: audience_filter_operator | string;
  created_at: string;
  updated_at: string;
};

export type AudienceFilter = {
  id: string;
  type: string;
  value: string;
  description: string;
  operator: audience_filter_operator | string;
};

export type AudienceSegmentMembership = {
  id: string;
  segment_id: string;
  user_id: string;
  added_at: string;
  is_active: boolean;
  score?: number;
};

export type AudienceSegmentAnalytics = {
  id: string;
  segment_id: string;
  date: string;
  total_members: number;
  engagement_rate?: number;
  conversion_rate?: number;
  campaign_id?: string;
  created_at: string;
  updated_at: string;
};
