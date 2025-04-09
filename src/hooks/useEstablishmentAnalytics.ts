
import { useState, useEffect, useMemo } from 'react';
import { 
  fetchVisitorAnalytics, 
  fetchTrendData,
  fetchRevenueReports,
  fetchDrinkPopularity,
  EstablishmentAnalytics,
  TrendDataPoint,
  RevenueReport,
  DrinkPopularity,
  AnalyticsDateRange
} from '@/services/establishmentAnalyticsService';

interface UseEstablishmentAnalyticsProps {
  establishmentId: string;
  range: AnalyticsDateRange;
}

interface EstablishmentAnalyticsData {
  visitorAnalytics: EstablishmentAnalytics[];
  visitorTrends: TrendDataPoint[];
  retentionTrends: TrendDataPoint[];
  revenueReports: RevenueReport[];
  popularDrinks: DrinkPopularity[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

// Cache for analytics data to prevent flickering with stable mock data
const analyticsCache: Record<string, {
  visitorAnalytics: EstablishmentAnalytics[];
  visitorTrends: TrendDataPoint[];
  retentionTrends: TrendDataPoint[];
  revenueReports: RevenueReport[];
  popularDrinks: DrinkPopularity[];
  timestamp: number;
}> = {};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export function useEstablishmentAnalytics({
  establishmentId,
  range
}: UseEstablishmentAnalyticsProps): EstablishmentAnalyticsData {
  const [visitorAnalytics, setVisitorAnalytics] = useState<EstablishmentAnalytics[]>([]);
  const [visitorTrends, setVisitorTrends] = useState<TrendDataPoint[]>([]);
  const [retentionTrends, setRetentionTrends] = useState<TrendDataPoint[]>([]);
  const [revenueReports, setRevenueReports] = useState<RevenueReport[]>([]);
  const [popularDrinks, setPopularDrinks] = useState<DrinkPopularity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<number>(0);

  // Create a cache key based on establishmentId and date range
  const cacheKey = useMemo(() => {
    const startDate = range.startDate.toISOString().split('T')[0];
    const endDate = range.endDate.toISOString().split('T')[0];
    return `${establishmentId}-${startDate}-${endDate}`;
  }, [establishmentId, range.startDate, range.endDate]);

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
    if (!establishmentId) {
      setIsLoading(false);
      setError("No establishment ID provided");
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
          console.log("Using cached analytics data");
          const cachedData = analyticsCache[cacheKey];
          setVisitorAnalytics(cachedData.visitorAnalytics);
          setVisitorTrends(cachedData.visitorTrends);
          setRetentionTrends(cachedData.retentionTrends);
          setRevenueReports(cachedData.revenueReports);
          setPopularDrinks(cachedData.popularDrinks);
          setIsLoading(false);
          return;
        }

        // Fetch all data in parallel for better performance
        const [visitors, visitorTrendData, retentionTrendData, revenue, drinks] = await Promise.all([
          fetchVisitorAnalytics(establishmentId, range),
          fetchTrendData(establishmentId, 'visitor_count', range),
          fetchTrendData(establishmentId, 'retention_rate', range),
          fetchRevenueReports(establishmentId, range),
          fetchDrinkPopularity(establishmentId)
        ]);

        // Update state with fetched data
        setVisitorAnalytics(visitors);
        setVisitorTrends(visitorTrendData);
        setRetentionTrends(retentionTrendData);
        setRevenueReports(revenue);
        setPopularDrinks(drinks);

        // Cache the results
        if (cacheKey) {
          analyticsCache[cacheKey] = {
            visitorAnalytics: visitors,
            visitorTrends: visitorTrendData,
            retentionTrends: retentionTrendData,
            revenueReports: revenue,
            popularDrinks: drinks,
            timestamp: Date.now()
          };
        }
      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalyticsData();
  }, [establishmentId, cacheKey, refreshToken]);

  return {
    visitorAnalytics,
    visitorTrends,
    retentionTrends,
    revenueReports,
    popularDrinks,
    isLoading,
    error,
    refresh
  };
}
