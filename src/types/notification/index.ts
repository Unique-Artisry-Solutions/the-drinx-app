
/**
 * Barrel export file for Notification related types
 */

export * from './NotificationTypes';
export * from './ToastTypes';

// Re-export the Notification interface
export interface Notification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: {
    type?: string;
    [key: string]: any;
  };
  location_based?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  target_radius?: number;
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

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  user_id: string;
  device_info?: {
    userAgent?: string;
    platform?: string;
  };
}

// Define NotificationType type
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Re-export toast-related types for convenience
export type { ActionConfig } from '@/hooks/use-toast';
export type { ToastVariant } from './ToastTypes';
