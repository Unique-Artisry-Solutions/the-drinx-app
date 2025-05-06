export interface NotificationMetadata {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sound: boolean;
  vibration: boolean;
  timeWindowEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  locationBased?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  targetRadius?: number;
  segmentId?: string;
  abTest?: {
    variant: 'A' | 'B';
    content: string;
  };
  campaignId?: string;
}

export interface NotificationDeliveryStatus {
  push?: {
    success: boolean;
    timestamp: string;
  };
  email?: {
    success: boolean;
    timestamp: string;
  };
}

export interface PushSubscription {
  id?: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  device_info?: {
    userAgent?: string;
    language?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  category_id: string;
  channels: ('email' | 'push' | 'in_app')[];
  is_enabled: boolean;
  metadata: NotificationMetadata;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'test' | 'system' | 'promotional' | 'alert' | 'bar-crawl' | 'establishment' | 'promoter' | 'recipe_submission' | 'mocktail_review' | 'marketing_material' | 'new_mocktail';

export interface NotificationCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Notification {
  id: string;
  recipient_id: string;  
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category_id?: string;
  metadata?: Record<string, any>;
  delivery_status?: NotificationDeliveryStatus;
  delivery_attempts?: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  recipient_type?: 'individual' | 'establishment' | 'promoter';
  location_based?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  target_radius?: number;
  scheduled_for?: string;
}

export interface PromoterNotificationType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromoterNotificationPreference {
  id: string;
  promoter_id: string;
  notification_type_id: string;
  is_enabled: boolean;
  channels: ('email' | 'push' | 'in_app')[];
  created_at: string;
  updated_at: string;
}

export interface EstablishmentNotificationType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstablishmentNotificationPreference {
  id: string;
  establishment_id: string;
  notification_type_id: string;
  is_enabled: boolean;
  channels: ('email' | 'push' | 'in_app')[];
  created_at: string;
  updated_at: string;
}

export interface NotificationFormData {
  email_notifications: boolean;
  push_notifications: boolean;
  global_quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  notification_categories: Record<string, {
    enabled: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    channels: {
      email: boolean;
      push: boolean;
    };
    sound: boolean;
    vibration: boolean;
    timeWindow: {
      enabled: boolean;
      start: string;
      end: string;
    };
    segments?: Record<string, boolean>; // Which segments should receive this notification type
  }>;
}

export interface EventNotificationSchedule {
  id: string;
  event_id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_for: string;
  location_based: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  target_radius?: number;
  created_at: string;
  updated_at: string;
  segment_id?: string;
  ab_test_enabled?: boolean;
  content_variants?: {
    a: string;
    b: string;
    distribution: number;
  };
}
