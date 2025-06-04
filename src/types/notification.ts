
/**
 * Central notification type definition
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  content: string; // Add content property for backward compatibility
  type: 'success' | 'error' | 'warning' | 'info';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: number;
  created_at: string; // Add created_at for backward compatibility
  read: boolean;
  is_read: boolean; // Add is_read for backward compatibility
  location_based?: boolean; // Add location_based property
  coordinates?: any; // Add coordinates property
  target_radius?: number; // Add target_radius property
  metadata?: {
    type?: string;
    [key: string]: any;
  };
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
}

export interface NotificationFormData {
  email_notifications: boolean;
  push_notifications: boolean;
  global_quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  notification_categories: Record<string, NotificationCategory>;
}

export interface NotificationCategory {
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
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  category_id: string;
  is_enabled: boolean;
  channels: ('email' | 'push' | 'in_app')[];
  metadata?: NotificationMetadata;
  created_at: string;
  updated_at: string;
}

export interface NotificationMetadata {
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  sound?: boolean;
  vibration?: boolean;
  timeWindowEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  [key: string]: any;
}
