
export interface FollowerSegment {
  id: string;
  name: string;
  type: 'all' | 'tier' | 'location' | 'engagement';
  count: number;
  criteria?: Record<string, any>;
}

export interface FollowerNotificationRequest {
  targetType: 'all' | 'tier' | 'specific';
  specificTiers?: string[];
  message: string;
  discountCode?: string;
  includeEmail: boolean;
  includePush: boolean;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationResult {
  success: boolean;
  sentCount: number;
  errors?: string[];
}
