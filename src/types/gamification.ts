
export interface Badge {
  id: string;
  promoter_id?: string;
  category: 'engagement' | 'social' | 'loyalty' | 'activity' | 'special' | 'milestone';
  name: string;
  description?: string;
  icon?: string;
  color_code: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: Record<string, any>;
  points_reward: number;
  unlock_condition: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyMilestone {
  id: string;
  promoter_id?: string;
  milestone_name: string;
  tier_level: number;
  requirements: Record<string, any>;
  rewards: string[];
  auto_upgrade: boolean;
  points_threshold?: number;
  engagement_threshold?: number;
  time_requirement_days?: number;
  special_conditions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GamificationReward {
  id: string;
  promoter_id?: string;
  reward_type: 'exclusive_content' | 'early_access' | 'discount' | 'merchandise' | 'experience' | 'digital_perk';
  name: string;
  description?: string;
  cost_points?: number;
  cost_tier_level?: number;
  availability_start?: string;
  availability_end?: string;
  max_redemptions?: number;
  current_redemptions: number;
  reward_data: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FollowerAchievement {
  id: string;
  follower_id: string;
  achievement_type: 'badge' | 'milestone' | 'tier_upgrade' | 'special';
  achievement_id?: string;
  badge_id?: string;
  milestone_id?: string;
  earned_at: string;
  points_earned: number;
  progress_data: Record<string, any>;
  notification_sent: boolean;
  celebration_viewed: boolean;
  metadata: Record<string, any>;
  badge?: Badge;
  milestone?: LoyaltyMilestone;
}

export interface LoyaltyPoints {
  id: string;
  follower_id: string;
  current_points: number;
  lifetime_points: number;
  points_spent: number;
  last_earned_at?: string;
  last_spent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BadgeProgress {
  badge: Badge;
  earned: boolean;
  progress_percentage: number;
  current_progress: Record<string, any>;
  missing_requirements: Record<string, any>;
}

export interface TierProgress {
  current_tier: number;
  current_tier_name: string;
  next_tier?: number;
  next_tier_name?: string;
  progress_percentage: number;
  requirements_met: Record<string, boolean>;
  points_to_next_tier: number;
  days_to_next_tier: number;
}
