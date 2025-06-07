
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

// Updated interfaces for proper communication - fixed message payload structure
export interface NotificationPayload {
  followerId: string;
  message: string;
  title?: string;
  subject?: string; // Added for backward compatibility
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

// Bulk messaging interface - updated to match component usage
export interface BulkNotificationPayload {
  followerIds: string[];
  message: string;
  title?: string;
  subject?: string; // Added for backward compatibility
  metadata?: Record<string, any>;
}

// Updated FollowerData interface with safe property access patterns
export interface FollowerData {
  // Core properties
  id: string;
  user_id?: string; // Made optional with safe access
  promoter_id: string;
  followed_at?: string; // Made optional
  notifications_enabled?: boolean; // Made optional
  engagement_score?: number;
  preferences?: FollowerPreferences;
  last_seen?: string;
  status?: 'active' | 'paused' | 'cancelled';
  tier?: string;
  
  // Database column mappings (safe access)
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
  
  // Safe property additions
  gamification_score?: number;
  loyalty_tier_level?: number;
  subscription_start?: string;
  last_interaction_at?: string;
  
  // User profile data with safe access
  display_name?: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  
  // Database properties with safe defaults
  churn_risk_score?: number;
  discovery_source?: string;
  discovery_metadata?: Record<string, any>;
  engagement_count?: number;
  
  // Profile relationship data (safe access)
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
