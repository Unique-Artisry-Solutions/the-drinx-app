
export interface Subscription {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  tier_id?: string | null; // Optional for free followers
  subscription_start: string;
  subscription_end?: string;
  status: 'active' | 'cancelled' | 'expired';
  follow_status: 'active' | 'paused' | 'cancelled' | 'pending';
  created_at: string;
  updated_at: string;
  promoter_name?: string;
  tier_name?: string;
  subscription_settings?: SubscriptionSettings;
  notification_preferences: NotificationPreferences;
}

export interface SubscriptionTier {
  id: string;
  promoter_id: string;
  name: string;
  price: number; // Keep for potential future premium following features
  tier: 'basic' | 'premium' | 'vip';
  features: Record<string, any>[];
  is_active: boolean;
  is_free: boolean; // Most following will be free
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  events: boolean;
  promotions: boolean;
  announcements: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
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

// New types for app-level subscriptions
export interface AppSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id?: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}
