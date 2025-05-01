
import { DateRange } from 'react-day-picker';

export interface PromoterAnalytics {
  date: string;
  total_views: number;
  unique_visitors: number;
  engagement_rate: number;
  conversion_rate: number;
}

export interface EventPerformance {
  id: string;
  name: string;
  date: string;
  venue_name: string;
  attendees: number;
  revenue: number;
}

export interface EventDetailedAnalytics {
  id: string;
  event_id: string;
  metric_name: string;
  metric_value: number;
  segment?: string;
  date: string;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  status: string;
  reach: number;
  engagement: number;
  conversion_rate: number;
  start_date: string;
  end_date: string;
}

export interface AudienceMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  segment: string;
}

export interface TrendDataPoint {
  id: string;
  date: string;
  metric_value: number;
}

export interface AnalyticsDateRange {
  startDate: Date;
  endDate: Date;
}

export interface UsePromoterAnalyticsProps {
  promoterId?: string;
  range: DateRange | undefined;
}

export interface PromoterAnalyticsData {
  analytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  subscriberTrend: TrendDataPoint[];
  engagementTrend: TrendDataPoint[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  fetchEventDetails: (eventId: string) => Promise<EventDetailedAnalytics[]>;
}

// In-memory cache for analytics data with expiry
export interface AnalyticsCache {
  analytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  subscriberTrend: TrendDataPoint[];
  engagementTrend: TrendDataPoint[];
  timestamp: number;
}
