
export interface Subscription {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  tier_id?: string | null; // Now optional for free followers
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
  price: number;
  tier: 'basic' | 'premium' | 'vip';
  features: Record<string, any>[];
  is_active: boolean;
  is_free: boolean; // New field for free tiers
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
