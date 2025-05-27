
export interface FollowerComponentProps {
  promoterId: string;
  className?: string;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export interface FollowerListProps extends FollowerComponentProps {
  searchTerm?: string;
  filters?: FollowerFilters;
  showActions?: boolean;
  maxItems?: number;
}

export interface FollowerFilters {
  tier?: string;
  status?: 'active' | 'paused' | 'cancelled';
  notificationsEnabled?: boolean;
  joinedAfter?: Date;
  joinedBefore?: Date;
}

export interface FollowerAnalyticsProps extends FollowerComponentProps {
  detailed?: boolean;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  metrics?: string[];
}

export interface FollowerNotificationProps extends FollowerComponentProps {
  followerCount?: number;
  defaultMessage?: string;
  allowScheduling?: boolean;
}

export interface FollowerLoadingState {
  isLoading: boolean;
  error?: string | null;
  progress?: number;
}

export interface FollowerActionResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

// Updated interface for FollowerNotificationCenter with followerCount
export interface FollowerNotificationCenterProps extends FollowerComponentProps {
  followerCount?: number;
  defaultMessage?: string;
  allowScheduling?: boolean;
}

// Add interface for follower preferences
export interface FollowerPreferences {
  events: boolean;
  promotions: boolean;
  generalUpdates: boolean;
  email: boolean;
  push: boolean;
  sms?: boolean;
}
