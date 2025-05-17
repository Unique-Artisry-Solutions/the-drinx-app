
export interface Follower {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  subscription_start: string;
  subscription_end?: string;
  follow_status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
  promoter_name?: string;
  notification_preferences?: {
    events: boolean;
    promotions: boolean;
    announcements: boolean;
  };
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
  id?: string;
  user_id: string;
  location_sharing: boolean;
  notification_radius: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventNotificationSchedule {
  id?: string;
  event_id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_for: string;
  location_based: boolean;
  coordinates?: { 
    latitude: number; 
    longitude: number; 
  } | null;
  target_radius?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface AppSubscription {
  id: string;
  user_id: string;
  subscription_type: 'free' | 'basic' | 'premium' | 'vip';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  payment_provider?: string;
  payment_id?: string;
  subscription_start: string;
  subscription_end?: string;
  created_at: string;
  updated_at: string;
}
