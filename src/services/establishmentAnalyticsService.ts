
import { supabaseClient } from '@/lib/supabaseClient';

export interface AnalyticsDateRange {
  startDate: Date;
  endDate: Date;
}

export interface EstablishmentAnalytics {
  id: string;
  establishment_id: string;
  date: string;
  total_visitors: number;
  unique_visitors: number;
  returning_visitors: number;
  average_rating: number | null;
  total_revenue: number;
}

export interface TrendDataPoint {
  id: string;
  establishment_id: string;
  metric_name: string;
  metric_value: number;
  timestamp: string;
  tags: Record<string, any>;
}

export interface RevenueReport {
  establishment_id: string;
  month: string;
  monthly_revenue: number;
  transaction_count: number;
  average_transaction: number;
  period_start: string;
  period_end: string;
}

export interface DrinkPopularity {
  establishment_id: string;
  cocktail_id: string;
  cocktail_name: string;
  review_count: number;
  average_rating: number;
  unique_reviewers: number;
  month: string;
}

// Create mock data for development until types are properly set up
const createMockData = (establishmentId: string) => {
  // Mock visitor analytics
  const visitorAnalytics: EstablishmentAnalytics[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    const visitors = Math.floor(Math.random() * 50) + 10;
    return {
      id: `va-${i}`,
      establishment_id: establishmentId,
      date: date.toISOString().split('T')[0],
      total_visitors: visitors,
      unique_visitors: Math.floor(visitors * 0.7),
      returning_visitors: Math.floor(visitors * 0.3),
      average_rating: 3.5 + Math.random() * 1.5,
      total_revenue: Math.floor(Math.random() * 1000) + 500
    };
  });

  // Mock trend data
  const trendData: TrendDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    return {
      id: `tp-${i}`,
      establishment_id: establishmentId,
      metric_name: 'visitor_count',
      metric_value: Math.floor(Math.random() * 50) + 10,
      timestamp: date.toISOString(),
      tags: { date: date.toISOString().split('T')[0] }
    };
  });

  // Mock revenue reports
  const revenueReports: RevenueReport[] = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 5 + i);
    const startDate = new Date(date);
    startDate.setDate(1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const revenue = Math.floor(Math.random() * 10000) + 2000;
    const transactions = Math.floor(Math.random() * 200) + 50;
    
    return {
      establishment_id: establishmentId,
      month: date.toISOString().split('T')[0],
      monthly_revenue: revenue,
      transaction_count: transactions,
      average_transaction: revenue / transactions,
      period_start: startDate.toISOString().split('T')[0],
      period_end: endDate.toISOString().split('T')[0]
    };
  });

  // Mock drink popularity
  const drinkPopularity: DrinkPopularity[] = [
    {
      establishment_id: establishmentId,
      cocktail_id: 'c1',
      cocktail_name: 'Virgin Mojito',
      review_count: 45,
      average_rating: 4.7,
      unique_reviewers: 42,
      month: new Date().toISOString()
    },
    {
      establishment_id: establishmentId,
      cocktail_id: 'c2',
      cocktail_name: 'Sparkling Berry Lemonade',
      review_count: 38,
      average_rating: 4.5,
      unique_reviewers: 36,
      month: new Date().toISOString()
    },
    {
      establishment_id: establishmentId,
      cocktail_id: 'c3',
      cocktail_name: 'Cucumber Mint Cooler',
      review_count: 32,
      average_rating: 4.3,
      unique_reviewers: 31,
      month: new Date().toISOString()
    },
    {
      establishment_id: establishmentId,
      cocktail_id: 'c4',
      cocktail_name: 'Pineapple Ginger Fizz',
      review_count: 29,
      average_rating: 4.2,
      unique_reviewers: 27,
      month: new Date().toISOString()
    },
    {
      establishment_id: establishmentId,
      cocktail_id: 'c5',
      cocktail_name: 'Watermelon Basil Refresher',
      review_count: 25,
      average_rating: 4.1,
      unique_reviewers: 24,
      month: new Date().toISOString()
    }
  ];

  return {
    visitorAnalytics,
    trendData,
    revenueReports,
    drinkPopularity
  };
};

/**
 * Fetches visitor analytics for an establishment
 */
export async function fetchVisitorAnalytics(
  establishmentId: string, 
  range: AnalyticsDateRange
): Promise<EstablishmentAnalytics[]> {
  try {
    // Use mock data for now
    const { visitorAnalytics } = createMockData(establishmentId);
    return visitorAnalytics.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate >= range.startDate && dataDate <= range.endDate;
    });
  } catch (error) {
    console.error('Error fetching visitor analytics:', error);
    return [];
  }
}

/**
 * Fetches trend data points for a specific metric
 */
export async function fetchTrendData(
  establishmentId: string,
  metricName: string,
  range: AnalyticsDateRange
): Promise<TrendDataPoint[]> {
  try {
    // Use mock data for now
    const { trendData } = createMockData(establishmentId);
    return trendData.filter(data => {
      const dataDate = new Date(data.timestamp);
      return dataDate >= range.startDate && dataDate <= range.endDate;
    });
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return [];
  }
}

/**
 * Fetches revenue reports for an establishment
 */
export async function fetchRevenueReports(
  establishmentId: string, 
  range: AnalyticsDateRange
): Promise<RevenueReport[]> {
  try {
    // Use mock data for now
    const { revenueReports } = createMockData(establishmentId);
    return revenueReports.filter(report => {
      const reportDate = new Date(report.month);
      return reportDate >= range.startDate && reportDate <= range.endDate;
    });
  } catch (error) {
    console.error('Error fetching revenue reports:', error);
    return [];
  }
}

/**
 * Fetches drink popularity metrics for an establishment
 */
export async function fetchDrinkPopularity(
  establishmentId: string
): Promise<DrinkPopularity[]> {
  try {
    // Use mock data for now
    const { drinkPopularity } = createMockData(establishmentId);
    return drinkPopularity;
  } catch (error) {
    console.error('Error fetching drink popularity:', error);
    return [];
  }
}

/**
 * Records a new visitor session
 */
export async function recordVisitorSession(establishmentId: string, isReturning: boolean = false): Promise<boolean> {
  try {
    // Just log the action for now
    console.log(`Recording session for establishment ${establishmentId}, returning: ${isReturning}`);
    return true;
  } catch (error) {
    console.error('Error recording visitor session:', error);
    return false;
  }
}

/**
 * Records a revenue entry
 */
export async function recordRevenueEntry(
  establishmentId: string,
  amount: number,
  source: string,
  notes?: string,
  entryDate?: Date
): Promise<boolean> {
  try {
    // Just log the action for now
    console.log(`Recording revenue for establishment ${establishmentId}, amount: $${amount}`);
    return true;
  } catch (error) {
    console.error('Error recording revenue entry:', error);
    return false;
  }
}
