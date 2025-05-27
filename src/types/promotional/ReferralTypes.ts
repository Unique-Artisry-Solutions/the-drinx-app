
// Referral System Types
export interface ReferralProgram {
  id: string;
  promoter_id: string;
  name: string;
  description?: string;
  referrer_reward_type: 'points' | 'percentage' | 'fixed';
  referrer_reward_value: number;
  referee_reward_type: 'points' | 'percentage' | 'fixed';
  referee_reward_value: number;
  max_uses_per_user?: number;
  expiration_date?: string;
  is_active: boolean;
  tier_multipliers: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ReferralTier {
  id: string;
  referral_program_id: string;
  tier_name: string;
  min_referrals: number;
  bonus_multiplier: number;
  tier_order: number;
  benefits: any[];
  created_at: string;
  updated_at: string;
}

export interface UserReferral {
  id: string;
  referral_program_id: string;
  referrer_id: string;
  referee_id?: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  conversion_event?: string;
  conversion_data: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralReward {
  id: string;
  user_referral_id: string;
  user_id: string;
  reward_type: 'referrer' | 'referee';
  reward_amount: number;
  reward_points?: number;
  status: 'pending' | 'awarded' | 'cancelled';
  awarded_at?: string;
  tier_bonus_applied: number;
  created_at: string;
  updated_at: string;
}

export interface ReferralAnalytics {
  total_referrals: number;
  successful_referrals: number;
  conversion_rate: number;
  total_rewards_distributed: number;
  top_referrers: Array<{
    user_id: string;
    referral_count: number;
    total_earnings: number;
  }>;
}
