
export interface UserRewardPreference {
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
