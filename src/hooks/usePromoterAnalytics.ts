
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
  fetchEventDetails,
  fetchAudienceDemographics,
  fetchAudienceRetention,
  fetchCampaignROI,
  PromoterAnalytics,
  EventPerformance,
  CampaignPerformance,
  AudienceMetric,
  TrendDataPoint,
  EventDetails,
  AudienceDemographicData,
  AudienceRetentionData,
  CampaignROIData
} from '@/services/promoterAnalyticsService';

interface UsePromoterAnalyticsProps {
  promoterId?: string;
  range: DateRange | undefined;
  selectedEventId?: string | null;
  selectedCampaignId?: string | null;
}

interface PromoterAnalyticsData {
  analytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  subscriberTrend: TrendDataPoint[];
  engagementTrend: TrendDataPoint[];
  eventDetails: EventDetails | null;
  audienceDemographics: AudienceDemographicData[] | null;
  audienceRetention: AudienceRetentionData[] | null;
  campaignROI: CampaignROIData | null;
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
  eventDetails: EventDetails | null;
  audienceDemographics: AudienceDemographicData[] | null;
  audienceRetention: AudienceRetentionData[] | null;
  campaignROI: CampaignROIData | null;
  timestamp: number;
}> = {};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export function usePromoterAnalytics({
  promoterId: providedPromoterId,
  range,
  selectedEventId = null,
  selectedCampaignId = null
}: UsePromoterAnalyticsProps): PromoterAnalyticsData {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<PromoterAnalytics[]>([]);
  const [eventPerformance, setEventPerformance] = useState<EventPerformance[]>([]);
  const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance[]>([]);
  const [audienceMetrics, setAudienceMetrics] = useState<AudienceMetric[]>([]);
  const [subscriberTrend, setSubscriberTrend] = useState<TrendDataPoint[]>([]);
  const [engagementTrend, setEngagementTrend] = useState<TrendDataPoint[]>([]);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [audienceDemographics, setAudienceDemographics] = useState<AudienceDemographicData[] | null>(null);
  const [audienceRetention, setAudienceRetention] = useState<AudienceRetentionData[] | null>(null);
  const [campaignROI, setCampaignROI] = useState<CampaignROIData | null>(null);
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
    return `${promoterId}-${startDate}-${endDate}-${selectedEventId || ''}-${selectedCampaignId || ''}`;
  }, [promoterId, range, selectedEventId, selectedCampaignId]);

  // Function to refresh all data
  const refresh = () => {
    // Invalidate cache for this key
    if (cacheKey && analyticsCache[cacheKey]) {
      delete analyticsCache[cacheKey];
    }
    setRefreshToken(prev => prev + 1);
  };

  // Effect to fetch event details when selectedEventId changes
  useEffect(() => {
    if (selectedEventId) {
      setIsLoading(true);
      fetchEventDetails(selectedEventId)
        .then(data => {
          setEventDetails(data);
        })
        .catch(err => {
          console.error('Error fetching event details:', err);
          setError('Failed to load event details');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setEventDetails(null);
    }
  }, [selectedEventId]);

  // Effect to fetch campaign ROI data when selectedCampaignId changes
  useEffect(() => {
    if (selectedCampaignId) {
      setIsLoading(true);
      fetchCampaignROI(selectedCampaignId)
        .then(data => {
          setCampaignROI(data);
        })
        .catch(err => {
          console.error('Error fetching campaign ROI data:', err);
          setError('Failed to load campaign ROI data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCampaignROI(null);
    }
  }, [selectedCampaignId]);

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
          setAudienceDemographics(cachedData.audienceDemographics);
          setAudienceRetention(cachedData.audienceRetention);
          
          if (selectedEventId && cachedData.eventDetails) {
            setEventDetails(cachedData.eventDetails);
          }
          
          if (selectedCampaignId && cachedData.campaignROI) {
            setCampaignROI(cachedData.campaignROI);
          }
          
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
          engagementTrendData,
          demographics,
          retention
        ] = await Promise.all([
          fetchPromoterAnalytics(promoterId, dateRange),
          fetchEventPerformance(promoterId),
          fetchCampaignPerformance(promoterId),
          fetchAudienceMetrics(promoterId),
          fetchTrendData(promoterId, 'subscriber_growth', dateRange),
          fetchTrendData(promoterId, 'engagement_rate', dateRange),
          fetchAudienceDemographics(promoterId),
          fetchAudienceRetention(promoterId)
        ]);

        // Update state with fetched data
        setAnalytics(analyticsData);
        setEventPerformance(events);
        setCampaignPerformance(campaigns);
        setAudienceMetrics(audience);
        setSubscriberTrend(subscriberTrendData);
        setEngagementTrend(engagementTrendData);
        setAudienceDemographics(demographics);
        setAudienceRetention(retention);

        // Cache the results
        if (cacheKey) {
          analyticsCache[cacheKey] = {
            analytics: analyticsData,
            eventPerformance: events,
            campaignPerformance: campaigns,
            audienceMetrics: audience,
            subscriberTrend: subscriberTrendData,
            engagementTrend: engagementTrendData,
            eventDetails: null,
            audienceDemographics: demographics,
            audienceRetention: retention,
            campaignROI: null,
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
    eventDetails,
    audienceDemographics,
    audienceRetention,
    campaignROI,
    isLoading,
    error,
    refresh
  };
}
