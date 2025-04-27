import { supabase } from '@/lib/supabase';
import type { RewardAnalytics, RewardMetric } from '../types';
import { RewardsCache } from '../system/RewardsCache';
import { RewardsSystemMonitor } from '../system/RewardsSystemMonitor';

export async function getRewardAnalytics(establishmentId?: string) {
  const startTime = performance.now();

  try {
    // Check cache first
    const cacheKey = `reward_analytics_${establishmentId || 'all'}`;
    const cacheStatus = await RewardsCache.getCacheStatus(cacheKey);

    if (cacheStatus && !cacheStatus.is_invalidated && cacheStatus.last_updated) {
      const lastUpdateTime = new Date(cacheStatus.last_updated).getTime();
      const ttl = (cacheStatus.ttl_seconds || 300) * 1000;
      
      if (Date.now() - lastUpdateTime < ttl) {
        // Cache is still valid, use materialized view
        const { data, error } = await supabase
          .from('reward_analytics_materialized')
          .select()
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        return processAnalyticsData(data);
      }
    }

    // Cache invalid or expired, refresh materialized view
    await supabase.rpc('refresh_reward_analytics_materialized');
    
    // Update cache status
    await RewardsCache.updateCache(cacheKey);

    // Fetch fresh data
    const { data, error } = await supabase
      .from('reward_analytics_materialized')
      .select()
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    // Record performance metric
    const endTime = performance.now();
    await RewardsSystemMonitor.recordPerformanceMetric({
      metricType: 'analytics',
      metricName: 'fetch_duration',
      metricValue: endTime - startTime
    });

    return processAnalyticsData(data);
  } catch (error) {
    console.error('Error fetching reward analytics:', error);
    
    // Record error in system health
    await RewardsSystemMonitor.recordHealthMetric({
      status: 'error',
      transactionCount: 0,
      errorCount: 1,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return null;
  }
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

function processAnalyticsData(metrics: any[]): RewardAnalytics | null {
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
