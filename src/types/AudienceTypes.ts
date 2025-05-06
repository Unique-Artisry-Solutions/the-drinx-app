
// Define our own types instead of importing from integrations/supabase/types
// since those types are not available yet

export type audience_filter_operator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'greater_than' 
  | 'less_than' 
  | 'between' 
  | 'in_list';

export type audience_segment_status = 
  | 'draft' 
  | 'active' 
  | 'archived';

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

// New types for relationship mapping

export type AudienceRelationship = {
  id: string;
  source_user_id: string;
  target_user_id: string;
  relationship_type: 'influence' | 'interaction' | 'similarity';
  strength: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
};

export type AudienceNetworkNode = {
  id: string;
  user_id: string;
  segment_ids: string[];
  influence_score: number;
  position?: { x: number, y: number }; // For visualizations
  metadata?: Record<string, any>;
};

export type AudienceNetworkEdge = {
  source: string; // User ID
  target: string; // User ID
  weight: number;
  relationship_type: string;
  metadata?: Record<string, any>;
};

export type AudienceNetwork = {
  nodes: AudienceNetworkNode[];
  edges: AudienceNetworkEdge[];
  metadata?: {
    density?: number;
    centrality?: Record<string, number>;
    clusters?: Array<{id: string, members: string[]}>;
  };
};

export type SegmentConnectionStrength = {
  source_segment_id: string;
  target_segment_id: string;
  connection_strength: number;
  shared_members: number;
  interaction_frequency: number;
  conversion_rate?: number;
  similarity_score?: number;
};

export type InfluentialUser = {
  user_id: string;
  display_name?: string;
  influence_score: number;
  follower_count: number;
  engagement_rate: number;
  connected_segments: number;
  expertise_areas?: string[];
};

export type CrossSegmentEngagement = {
  primary_segment_id: string;
  secondary_segment_id: string;
  timeframe: string;
  engagement_rate: number;
  conversion_rate: number;
  overlap_percentage: number;
  correlation_score: number;
};
