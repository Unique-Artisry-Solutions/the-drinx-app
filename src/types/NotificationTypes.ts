
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
