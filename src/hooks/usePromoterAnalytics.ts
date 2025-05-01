
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/auth';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { 
  fetchPromoterAnalytics, 
  fetchEventPerformance,
  fetchCampaignPerformance,
  fetchAudienceMetrics,
  fetchTrendData,
  PromoterAnalytics,
  EventPerformance,
  CampaignPerformance,
  AudienceMetric,
  TrendDataPoint
} from '@/services/promoterAnalyticsService';

interface UsePromoterAnalyticsProps {
  promoterId?: string;
  range: DateRange | undefined;
}

interface PromoterAnalyticsData {
  analytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  subscriberTrend: TrendDataPoint[];
  engagementTrend: TrendDataPoint[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

// Cache for analytics data to prevent flickering with stable mock data
const analyticsCache: Record<string, {
  analytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  subscriberTrend: TrendDataPoint[];
  engagementTrend: TrendDataPoint[];
  timestamp: number;
}> = {};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export function usePromoterAnalytics({
  promoterId: providedPromoterId,
  range
}: UsePromoterAnalyticsProps): PromoterAnalyticsData {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<PromoterAnalytics[]>([]);
  const [eventPerformance, setEventPerformance] = useState<EventPerformance[]>([]);
  const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance[]>([]);
  const [audienceMetrics, setAudienceMetrics] = useState<AudienceMetric[]>([]);
  const [subscriberTrend, setSubscriberTrend] = useState<TrendDataPoint[]>([]);
  const [engagementTrend, setEngagementTrend] = useState<TrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<number>(0);

  // Use provided promoterId or fall back to the current authenticated user
  const promoterId = useMemo(() => 
    providedPromoterId || user?.id || '', 
    [providedPromoterId, user?.id]
  );

  // Create a cache key based on promoterId and date range
  const cacheKey = useMemo(() => {
    if (!range || !promoterId) return '';
    
    const startDate = range.from?.toISOString().split('T')[0] || '';
    const endDate = range.to?.toISOString().split('T')[0] || '';
    return `${promoterId}-${startDate}-${endDate}`;
  }, [promoterId, range]);

  // Function to refresh all data
  const refresh = () => {
    // Invalidate cache for this key
    if (cacheKey && analyticsCache[cacheKey]) {
      delete analyticsCache[cacheKey];
    }
    setRefreshToken(prev => prev + 1);
  };

  // Fetch all analytics data
  useEffect(() => {
    if (!promoterId) {
      setIsLoading(false);
      setError("No promoter ID provided");
      return;
    }

    if (!range || !range.from || !range.to) {
      setIsLoading(false);
      setError("Date range is required");
      return;
    }

    async function loadAnalyticsData() {
      setIsLoading(true);
      setError(null);

      try {
        // Check if we have valid cached data
        if (
          cacheKey && 
          analyticsCache[cacheKey] && 
          (Date.now() - analyticsCache[cacheKey].timestamp < CACHE_EXPIRY_MS)
        ) {
          console.log("Using cached promoter analytics data");
          const cachedData = analyticsCache[cacheKey];
          setAnalytics(cachedData.analytics);
          setEventPerformance(cachedData.eventPerformance);
          setCampaignPerformance(cachedData.campaignPerformance);
          setAudienceMetrics(cachedData.audienceMetrics);
          setSubscriberTrend(cachedData.subscriberTrend);
          setEngagementTrend(cachedData.engagementTrend);
          setIsLoading(false);
          return;
        }

        // Define date range for analytics
        const dateRange = {
          startDate: range.from || addDays(new Date(), -30),
          endDate: range.to || new Date()
        };

        // Fetch all data in parallel for better performance
        const [
          analyticsData, 
          events, 
          campaigns, 
          audience, 
          subscriberTrendData,
          engagementTrendData
        ] = await Promise.all([
          fetchPromoterAnalytics(promoterId, dateRange),
          fetchEventPerformance(promoterId),
          fetchCampaignPerformance(promoterId),
          fetchAudienceMetrics(promoterId),
          fetchTrendData(promoterId, 'subscriber_growth', dateRange),
          fetchTrendData(promoterId, 'engagement_rate', dateRange)
        ]);

        // Update state with fetched data
        setAnalytics(analyticsData);
        setEventPerformance(events);
        setCampaignPerformance(campaigns);
        setAudienceMetrics(audience);
        setSubscriberTrend(subscriberTrendData);
        setEngagementTrend(engagementTrendData);

        // Cache the results
        if (cacheKey) {
          analyticsCache[cacheKey] = {
            analytics: analyticsData,
            eventPerformance: events,
            campaignPerformance: campaigns,
            audienceMetrics: audience,
            subscriberTrend: subscriberTrendData,
            engagementTrend: engagementTrendData,
            timestamp: Date.now()
          };
        }
      } catch (err) {
        console.error('Error loading promoter analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalyticsData();
  }, [promoterId, cacheKey, refreshToken, range]);

  return {
    analytics,
    eventPerformance,
    campaignPerformance,
    audienceMetrics,
    subscriberTrend,
    engagementTrend,
    isLoading,
    error,
    refresh
  };
}
