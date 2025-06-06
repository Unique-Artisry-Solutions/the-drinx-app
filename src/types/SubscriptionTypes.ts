
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
  benefits: string[]; // Add benefits property
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

// Add the missing FollowerNotificationPreferences type
export interface FollowerNotificationPreferences {
  events: boolean;
  discounts: boolean;
  updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Database-compatible notification preferences type
export interface DatabaseNotificationPreferences {
  id: string;
  user_id: string;
  category_id: string;
  is_enabled: boolean;
  channels: ('email' | 'push' | 'in_app')[];
  metadata?: Record<string, any>;
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

// App-level subscription types - matches the database structure
export interface AppSubscription {
  id: string;
  user_id: string;
  subscription_type: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  subscription_start: string;
  subscription_end: string | null;
  payment_provider: string | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}
