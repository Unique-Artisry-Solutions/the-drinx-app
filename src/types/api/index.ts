
// API Response types - what our edge functions and API calls return
export interface ApiRewardCampaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled' | 'cancelled';
  is_active: boolean; // computed field
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: AudienceFilter[];
  rewards: CampaignReward[];
  trigger_conditions?: TriggerCondition[];
  performance_metrics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AudienceFilter {
  id: string;
  type: 'tier' | 'pointsRange' | 'activity' | 'joinDate' | 'demographics' | 'all';
  value: string;
  description: string;
}

export interface CampaignReward {
  id: string;
  type: 'points' | 'offering' | 'tier';
  value: string;
  description: string;
}

export interface TriggerCondition {
  id: string;
  type: 'visit' | 'purchase' | 'checkin' | 'review' | 'referral';
  value: string;
  description: string;
}

export interface ApiUserRewardPreference {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: any;
  created_at: string;
  updated_at: string;
  notification_settings?: {
    point_changes: boolean;
    tier_updates: boolean;
    reward_availability: boolean;
  };
  display_settings?: {
    points_format: 'standard' | 'compact';
    show_tier_progress: boolean;
  };
}

export interface ApiRewardOffering {
  id: string;
  name: string;
  description?: string;
  pointCost: number;
  availableQuantity?: number;
  points_required: number;
  pointsRequired: number;
  pointValue: number;
  quantity_available?: number;
  expiration_days?: number;
  is_active: boolean;
  image_url?: string;
  establishment_id: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
