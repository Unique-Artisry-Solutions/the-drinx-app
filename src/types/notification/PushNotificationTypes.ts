
/**
 * Types related to Push Notifications
 */

// Define the interface for our app's push subscription model
export interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;  // Public key
  auth: string;    // Auth secret
  user_id: string;
  device_info?: {
    userAgent?: string;
    platform?: string;
    language?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Define the interface for the web push subscription from the browser API
export interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Define a type that represents the subscription data as stored in Supabase
export interface DbPushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_id: string;
  device_info?: {
    userAgent?: string;
    platform?: string;
    language?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Type for PushSubscriptionJSON from browser API
export interface PushSubscriptionJSON {
  endpoint?: string;
  expirationTime?: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
}
