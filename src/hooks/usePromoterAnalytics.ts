
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
  fetchEventDetailedAnalytics,
  PromoterAnalytics,
  EventPerformance,
  CampaignPerformance,
  AudienceMetric,
  TrendDataPoint,
  EventDetailedAnalytics
} from '@/services/promoterAnalyticsService';
import { isPreviewEnvironment } from '@/utils/environment';

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
  fetchEventDetails: (eventId: string) => Promise<EventDetailedAnalytics[]>;
}

// In-memory cache for analytics data with expiry
interface AnalyticsCache {
  analytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  subscriberTrend: TrendDataPoint[];
  engagementTrend: TrendDataPoint[];
  timestamp: number;
}

const analyticsCache: Record<string, AnalyticsCache> = {};
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

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

  // Safe fallback for promoter ID
  const effectivePromoterId = useMemo(() => {
    if (isPreviewEnvironment()) {
      return providedPromoterId || 'preview-promoter-id';
    }
    return providedPromoterId || user?.id || '';
  }, [providedPromoterId, user?.id]);

  // Safe fallback for date range
  const effectiveRange = useMemo(() => {
    const defaultFrom = addDays(new Date(), -30);
    const defaultTo = new Date();
    
    if (!range) {
      return { from: defaultFrom, to: defaultTo };
    }
    
    return {
      from: range.from || defaultFrom,
      to: range.to || defaultTo
    };
  }, [range]);

  // Cache key based on promoterId and date range - with safety checks
  const cacheKey = useMemo(() => {
    if (!effectivePromoterId) return '';
    
    const startDate = effectiveRange.from ? 
      effectiveRange.from.toISOString().split('T')[0] : '';
    const endDate = effectiveRange.to ? 
      effectiveRange.to.toISOString().split('T')[0] : '';
    
    return `${effectivePromoterId}-${startDate}-${endDate}`;
  }, [effectivePromoterId, effectiveRange.from, effectiveRange.to]);

  // Refresh function that safely handles the cache
  const refresh = () => {
    if (cacheKey) {
      delete analyticsCache[cacheKey];
    }
    setRefreshToken(prev => prev + 1);
  };

  // Function to fetch detailed analytics with error handling
  const fetchEventDetails = async (eventId: string): Promise<EventDetailedAnalytics[]> => {
    if (!effectivePromoterId) return [];
    
    try {
      return await fetchEventDetailedAnalytics(effectivePromoterId, eventId);
    } catch (error) {
      console.error("Error fetching event details:", error);
      return [];
    }
  };

  // Main data fetching effect with improved error handling and preview safety
  useEffect(() => {
    // Safety check for required data
    if (!effectivePromoterId) {
      setIsLoading(false);
      setError("No promoter ID available");
      return;
    }

    async function loadAnalyticsData() {
      setIsLoading(true);
      setError(null);

      try {
        // Check for valid cached data
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

        // Define safe date range for analytics
        const dateRange = {
          startDate: effectiveRange.from,
          endDate: effectiveRange.to
        };

        // Fetch all data in parallel with proper error handling for each request
        const results = await Promise.allSettled([
          fetchPromoterAnalytics(effectivePromoterId, dateRange),
          fetchEventPerformance(effectivePromoterId),
          fetchCampaignPerformance(effectivePromoterId),
          fetchAudienceMetrics(effectivePromoterId),
          fetchTrendData(effectivePromoterId, 'subscriber_growth', dateRange),
          fetchTrendData(effectivePromoterId, 'engagement_rate', dateRange)
        ]);
        
        // Process results with safety checks for each promise
        const [
          analyticsResult,
          eventsResult,
          campaignsResult,
          audienceResult,
          subscriberTrendResult,
          engagementTrendResult
        ] = results;

        // Set values with safety checks for each result
        const analyticsData = analyticsResult.status === 'fulfilled' ? analyticsResult.value : [];
        const events = eventsResult.status === 'fulfilled' ? eventsResult.value : [];
        const campaigns = campaignsResult.status === 'fulfilled' ? campaignsResult.value : [];
        const audience = audienceResult.status === 'fulfilled' ? audienceResult.value : [];
        const subscriberTrendData = subscriberTrendResult.status === 'fulfilled' ? subscriberTrendResult.value : [];
        const engagementTrendData = engagementTrendResult.status === 'fulfilled' ? engagementTrendResult.value : [];

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
  }, [effectivePromoterId, cacheKey, refreshToken, effectiveRange.from, effectiveRange.to]);

  return {
    analytics,
    eventPerformance,
    campaignPerformance,
    audienceMetrics,
    subscriberTrend,
    engagementTrend,
    isLoading,
    error,
    refresh,
    fetchEventDetails
  };
}
