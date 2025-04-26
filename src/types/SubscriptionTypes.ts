
export interface Subscription {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  tier_id?: string;
  subscription_start: string;
  subscription_end?: string;
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
  promoter_name?: string;
  tier_name?: string;
}

export interface SubscriptionTier {
  id: string;
  promoter_id: string;
  name: string;
  price: number;
  tier: 'basic' | 'premium' | 'vip';
  features: Record<string, any>[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionSettings {
  id: string;
  user_id: string;
  location_sharing: boolean;
  notification_radius: number;
  notification_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}
