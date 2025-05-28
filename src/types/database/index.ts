
// Database types - direct mappings to Supabase tables
export interface DbRewardCampaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: any;
  rewards: any;
  trigger_conditions?: any;
  created_at: string;
  updated_at: string;
}

export interface DbUserRewardPreference {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: any;
  created_at: string;
  updated_at: string;
}

export interface DbRewardOffering {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  quantity_available?: number;
  expiration_days?: number;
  is_active: boolean;
  image_url?: string;
  establishment_id: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
