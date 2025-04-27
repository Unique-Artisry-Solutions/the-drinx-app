
import { supabase } from '@/lib/supabase';
import type { RewardAnalytics, RewardMetric, RewardSystemAnalyticsRow } from '../types';

export async function getRewardAnalytics(establishmentId?: string) {
  // Change the query to avoid deep typing issues
  let query = supabase
    .from('reward_system_analytics')
    .select('*');

  if (establishmentId) {
    query = query.eq('establishment_id', establishmentId);
  }
  
  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error('Error fetching reward analytics:', error);
    return null;
  }

  // Explicitly cast the data to the correct type
  return processAnalyticsData(data as RewardSystemAnalyticsRow[]);
}

export async function getDailyMetrics(date: Date, establishmentId?: string) {
  const { data, error } = await supabase
    .from('reward_usage_metrics')
    .select('*')
    .eq('metric_date', date.toISOString().split('T')[0])
    .eq('establishment_id', establishmentId);

  if (error) {
    console.error('Error fetching daily metrics:', error);
    return null;
  }

  return data as RewardMetric[];
}

function processAnalyticsData(metrics: RewardSystemAnalyticsRow[]): RewardAnalytics | null {
  if (!metrics || metrics.length === 0) {
    return {
      totalPointsEarned: 0,
      totalPointsRedeemed: 0,
      pointsEconomyBalance: 0,
      redemptionRate: 0,
      timeSeriesData: [],
      sourcesBreakdown: {}
    };
  }
  
  const timeSeriesMap = new Map<string, { earned: number, redeemed: number }>();
  let totalEarned = 0;
  let totalRedeemed = 0;
  
  metrics.forEach(metric => {
    const points = Number(metric.points_total) || 0;
    
    if (!timeSeriesMap.has(metric.date)) {
      timeSeriesMap.set(metric.date, { earned: 0, redeemed: 0 });
    }
    
    const entry = timeSeriesMap.get(metric.date)!;
    
    if (metric.transaction_type === 'earn') {
      entry.earned += points;
      totalEarned += points;
    } else if (metric.transaction_type === 'redeem') {
      entry.redeemed += points;
      totalRedeemed += points;
    }
  });
  
  const timeSeriesData = Array.from(timeSeriesMap.entries()).map(([date, values]) => ({
    date,
    pointsEarned: values.earned,
    pointsRedeemed: values.redeemed,
    netPoints: values.earned - values.redeemed
  })).sort((a, b) => a.date.localeCompare(b.date));
  
  const redemptionRate = totalEarned > 0 ? (totalRedeemed / totalEarned) * 100 : 0;
  
  return {
    totalPointsEarned: totalEarned,
    totalPointsRedeemed: totalRedeemed,
    pointsEconomyBalance: totalEarned - totalRedeemed,
    redemptionRate,
    timeSeriesData,
    sourcesBreakdown: {}
  };
}
