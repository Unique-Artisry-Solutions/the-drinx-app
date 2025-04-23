
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
}

export type NotificationType = 'test' | 'system' | 'promotional' | 'alert' | 'bar-crawl' | 'establishment';

export interface NotificationCategory {
  id: string;
  name: string;
  description?: string;
}

export interface NotificationPreferenceSettings {
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: {
    email: boolean;
    push: boolean;
  };
  sound: boolean;
  vibration: boolean;
  timeWindowEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_categories: {
    [key: string]: NotificationPreferenceSettings;
  };
}
