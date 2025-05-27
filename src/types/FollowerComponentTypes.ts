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
