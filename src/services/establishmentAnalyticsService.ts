
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

// Cache for mock data to ensure consistency between renders
const mockDataCache: Record<string, {
  visitorAnalytics: EstablishmentAnalytics[];
  trendData: TrendDataPoint[];
  revenueReports: RevenueReport[];
  drinkPopularity: DrinkPopularity[];
}> = {};

// Stable random function using seed
function seededRandom(seed: string, index: number): number {
  const seedValue = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combinedSeed = seedValue + index * 137;
  // Simple PRNG using a linear congruential generator
  const x = Math.sin(combinedSeed) * 10000;
  return x - Math.floor(x);
}

// Create mock data for development until types are properly set up
const createMockData = (establishmentId: string) => {
  // Check if we already have cached mock data for this establishment
  if (mockDataCache[establishmentId]) {
    return mockDataCache[establishmentId];
  }

  // Mock visitor analytics
  const visitorAnalytics: EstablishmentAnalytics[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    
    // Use seeded random to create stable but random-looking data
    const rand = seededRandom(establishmentId, i);
    const visitors = Math.floor(rand * 40) + 10;
    
    return {
      id: `va-${establishmentId}-${i}`,
      establishment_id: establishmentId,
      date: date.toISOString().split('T')[0],
      total_visitors: visitors,
      unique_visitors: Math.floor(visitors * (0.6 + seededRandom(establishmentId, i + 100) * 0.2)),
      returning_visitors: Math.floor(visitors * (0.2 + seededRandom(establishmentId, i + 200) * 0.2)),
      average_rating: 3 + seededRandom(establishmentId, i + 300) * 2,
      total_revenue: Math.floor(seededRandom(establishmentId, i + 400) * 700) + 300
    };
  });

  // Mock trend data
  const trendData: TrendDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    
    return {
      id: `tp-${establishmentId}-${i}`,
      establishment_id: establishmentId,
      metric_name: 'visitor_count',
      metric_value: Math.floor(seededRandom(establishmentId, i + 500) * 40) + 10,
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
    
    const revenue = Math.floor(seededRandom(establishmentId, i + 600) * 8000) + 2000;
    const transactions = Math.floor(seededRandom(establishmentId, i + 700) * 150) + 50;
    
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

  // Common mocktail names for consistency
  const mocktailNames = [
    'Virgin Mojito',
    'Sparkling Berry Lemonade',
    'Cucumber Mint Cooler',
    'Pineapple Ginger Fizz',
    'Watermelon Basil Refresher',
    'Tropical Paradise',
    'Blue Lagoon',
    'Peachy Sunrise',
    'Strawberry Fields',
    'Citrus Splash'
  ];

  // Mock drink popularity with consistent names
  const drinkPopularity: DrinkPopularity[] = mocktailNames.map((name, i) => {
    const reviewCount = Math.floor(seededRandom(establishmentId, i + 800) * 30) + 15;
    
    return {
      establishment_id: establishmentId,
      cocktail_id: `c${i + 1}`,
      cocktail_name: name,
      review_count: reviewCount,
      average_rating: 3.5 + seededRandom(establishmentId, i + 900) * 1.5,
      unique_reviewers: Math.floor(reviewCount * (0.8 + seededRandom(establishmentId, i + 1000) * 0.2)),
      month: new Date().toISOString()
    };
  });

  // Sort drinks by review count for consistency in visualization
  drinkPopularity.sort((a, b) => b.review_count - a.review_count);

  // Cache the generated mock data
  const mockData = {
    visitorAnalytics,
    trendData,
    revenueReports,
    drinkPopularity: drinkPopularity.slice(0, 5) // Only use top 5 for consistency
  };
  
  mockDataCache[establishmentId] = mockData;
  return mockData;
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
