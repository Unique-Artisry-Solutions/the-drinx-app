
import { supabase } from '@/lib/supabase';
import type { RewardAnalytics, DailyMetrics, RewardMetric } from '../types';

export async function getRewardAnalytics(establishmentId?: string) {
  const { data: metrics, error } = await supabase
    .from('reward_system_analytics')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching reward analytics:', error);
    return null;
  }

  return processAnalyticsData(metrics);
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
