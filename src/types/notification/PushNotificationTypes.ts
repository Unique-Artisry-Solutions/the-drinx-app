
// Basic push subscription types
export interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface WebPushSubscription {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
}

// Database representation of a push subscription
export interface DbPushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  device_info?: {
    userAgent?: string;
    platform?: string;
    language?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Application representation of a push subscription
export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  device_info?: {
    userAgent?: string;
    platform?: string;
    language?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Configuration for push notifications
export interface PushNotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  actions?: PushNotificationAction[];
  vibrate?: number[];
  silent?: boolean;
  requireInteraction?: boolean;
}

// Action buttons for push notifications
export interface PushNotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Types for sending notifications
export interface SendPushNotificationParams {
  subscription: PushSubscription;
  notification: PushNotificationConfig;
}

// Response from notification server
export interface PushNotificationResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

// Types for location-based push notifications
export interface LocationBasedNotificationConfig extends PushNotificationConfig {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
  event_id?: string;
}
