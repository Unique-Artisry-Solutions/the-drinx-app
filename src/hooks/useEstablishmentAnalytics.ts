
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

  // Function to refresh all data
  const refresh = () => {
    setRefreshToken(prev => prev + 1);
  };

  // Fetch all analytics data
  useEffect(() => {
    async function loadAnalyticsData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch visitor analytics
        const visitors = await fetchVisitorAnalytics(establishmentId, range);
        setVisitorAnalytics(visitors);

        // Fetch visitor trends
        const visitorTrendData = await fetchTrendData(establishmentId, 'visitor_count', range);
        setVisitorTrends(visitorTrendData);

        // Fetch retention trends
        const retentionTrendData = await fetchTrendData(establishmentId, 'retention_rate', range);
        setRetentionTrends(retentionTrendData);

        // Fetch revenue reports
        const revenue = await fetchRevenueReports(establishmentId, range);
        setRevenueReports(revenue);

        // Fetch popular drinks
        const drinks = await fetchDrinkPopularity(establishmentId);
        setPopularDrinks(drinks);
      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }

    if (establishmentId) {
      loadAnalyticsData();
    }
  }, [establishmentId, range, refreshToken]);

  // Format the data for easy consumption
  const formattedVisitorData = useMemo(() => {
    return visitorAnalytics.map(data => ({
      name: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: data.total_visitors,
      returningVisitors: data.returning_visitors,
      uniqueVisitors: data.unique_visitors,
      date: data.date
    }));
  }, [visitorAnalytics]);

  // Format the revenue data
  const formattedRevenueData = useMemo(() => {
    return revenueReports.map(report => ({
      name: new Date(report.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      revenue: report.monthly_revenue,
      transactions: report.transaction_count,
      average: report.average_transaction,
      month: report.month
    }));
  }, [revenueReports]);

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
