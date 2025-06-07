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

// Updated interfaces for proper communication
export interface NotificationPayload {
  followerId: string;
  message: string;
  title?: string;
  metadata?: Record<string, any>;
}

export interface FlyerPayload {
  followerId: string;
  flyer_url: string;
  metadata?: Record<string, any>;
}

export interface DiscountPayload {
  followerId: string;
  discount_code: string;
  metadata?: Record<string, any>;
}

// Bulk messaging interface
export interface BulkNotificationPayload {
  followerIds: string[];
  message: string;
  title?: string;
  metadata?: Record<string, any>;
}

// Updated FollowerData interface with all missing properties
export interface FollowerData {
  id: string;
  user_id: string;
  promoter_id: string;
  followed_at: string;
  notifications_enabled: boolean;
  engagement_score?: number;
  preferences?: FollowerPreferences;
  last_seen?: string;
  status?: 'active' | 'paused' | 'cancelled';
  tier?: string;
  // Properties that components are trying to access
  subscriber_id: string;
  follow_status: 'active' | 'paused' | 'cancelled';
  created_at: string;
  tier_id?: string;
  tier_name?: string;
  promoter_name?: string;
  engagement_tier?: string;
  follower_tier?: string;
  score_last_updated?: string;
  last_engagement_at?: string;
  notification_preferences?: FollowerPreferences;
  // New properties to fix build errors
  gamification_score?: number;
  loyalty_tier_level?: number;
  subscription_start?: string;
  last_interaction_at?: string;
  // User profile data (optional)
  display_name?: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  // Additional properties from database
  churn_risk_score?: number;
  discovery_source?: string;
  discovery_metadata?: Record<string, any>;
  engagement_count?: number;
  // Profile relationship data
  profiles?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
    email?: string;
  };
}

export interface FollowerAnalyticsData {
  growthData: Array<{
    date: string;
    newFollowers: number;
    totalFollowers: number;
    unfollowers: number;
  }>;
  engagementMetrics: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    averageEngagementRate: number;
    topPerformingContent: Array<{
      title: string;
      type: 'event' | 'promotion' | 'general';
      engagementScore: number;
      reach: number;
      clicks: number;
    }>;
  };
  demographics: {
    ageDistribution: Array<{ range: string; count: number; percentage: number; }>;
    genderDistribution: Array<{ gender: string; count: number; percentage: number; }>;
    locationData: Array<{ location: string; count: number; percentage: number; }>;
    interestCategories: Array<{ category: string; interestLevel: number; count: number; }>;
  };
}

export interface FollowerExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
  includeFields: {
    basicInfo: boolean;
    demographics: boolean;
    engagement: boolean;
    preferences: boolean;
    analytics: boolean;
  };
  segmentFilter?: string;
}
