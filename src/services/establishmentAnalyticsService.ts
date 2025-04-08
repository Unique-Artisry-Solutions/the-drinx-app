
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

/**
 * Fetches visitor analytics for an establishment
 */
export async function fetchVisitorAnalytics(
  establishmentId: string, 
  range: AnalyticsDateRange
): Promise<EstablishmentAnalytics[]> {
  const { data, error } = await supabaseClient
    .from('establishment_analytics')
    .select('*')
    .eq('establishment_id', establishmentId)
    .gte('date', range.startDate.toISOString().split('T')[0])
    .lte('date', range.endDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching visitor analytics:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetches trend data points for a specific metric
 */
export async function fetchTrendData(
  establishmentId: string,
  metricName: string,
  range: AnalyticsDateRange
): Promise<TrendDataPoint[]> {
  const { data, error } = await supabaseClient
    .from('trend_data_points')
    .select('*')
    .eq('establishment_id', establishmentId)
    .eq('metric_name', metricName)
    .gte('timestamp', range.startDate.toISOString())
    .lte('timestamp', range.endDate.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching trend data:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetches revenue reports for an establishment
 */
export async function fetchRevenueReports(
  establishmentId: string, 
  range: AnalyticsDateRange
): Promise<RevenueReport[]> {
  const { data, error } = await supabaseClient
    .from('revenue_reports')
    .select('*')
    .eq('establishment_id', establishmentId)
    .gte('period_start', range.startDate.toISOString().split('T')[0])
    .lte('period_end', range.endDate.toISOString().split('T')[0])
    .order('month', { ascending: false });

  if (error) {
    console.error('Error fetching revenue reports:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetches drink popularity metrics for an establishment
 */
export async function fetchDrinkPopularity(
  establishmentId: string
): Promise<DrinkPopularity[]> {
  const { data, error } = await supabaseClient
    .from('drink_popularity_metrics')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('review_count', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching drink popularity:', error);
    return [];
  }

  return data || [];
}

/**
 * Records a new visitor session
 */
export async function recordVisitorSession(establishmentId: string, isReturning: boolean = false): Promise<boolean> {
  const { error } = await supabaseClient
    .from('visitor_sessions')
    .insert({
      establishment_id: establishmentId,
      is_returning: isReturning
    });

  if (error) {
    console.error('Error recording visitor session:', error);
    return false;
  }

  return true;
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
  const { error } = await supabaseClient
    .from('revenue_entries')
    .insert({
      establishment_id: establishmentId,
      amount,
      source,
      notes,
      entry_date: entryDate ? entryDate.toISOString().split('T')[0] : undefined
    });

  if (error) {
    console.error('Error recording revenue entry:', error);
    return false;
  }

  return true;
}
