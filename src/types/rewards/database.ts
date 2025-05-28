
// Database layer types - match exactly what comes from Supabase
export interface RewardTierRow {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  points_required: number;
  benefits: string[] | any;
  color?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RewardOfferingRow {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  points_required: number;
  quantity_available?: number;
  expiration_days?: number;
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RewardTransactionRow {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: 'earn' | 'redeem';
  source: string;
  description?: string;
  metadata?: Record<string, any> | string | null;
  created_at: string;
  version?: number;
}

export interface UserRewardRow {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  lifetime_points: number;
  current_tier_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRewardPreferenceRow {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: any;
  created_at: string;
  updated_at: string;
}
