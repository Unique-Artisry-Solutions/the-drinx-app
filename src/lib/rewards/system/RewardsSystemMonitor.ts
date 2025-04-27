
import { supabase } from '@/lib/supabase';

export interface SystemHealthMetric {
  status: 'healthy' | 'degraded' | 'error';
  responseTime?: number;
  transactionCount: number;
  errorCount: number;
  details?: Record<string, any>;
}

export interface PerformanceMetric {
  metricType: string;
  metricName: string;
  metricValue: number;
  context?: Record<string, any>;
}

export class RewardsSystemMonitor {
  static async recordHealthMetric(metric: SystemHealthMetric) {
    const { error } = await supabase
      .from('reward_system_health')
      .insert({
        status: metric.status,
        response_time_ms: metric.responseTime,
        transaction_count: metric.transactionCount,
        error_count: metric.errorCount,
        details: metric.details
      });

    if (error) {
      console.error('Error recording health metric:', error);
    }
  }

  static async recordPerformanceMetric(metric: PerformanceMetric) {
    const { error } = await supabase
      .from('reward_performance_metrics')
      .insert({
        metric_type: metric.metricType,
        metric_name: metric.metricName,
        metric_value: metric.metricValue,
        context: metric.context
      });

    if (error) {
      console.error('Error recording performance metric:', error);
    }
  }

  static async getSystemHealth() {
    const { data, error } = await supabase
      .from('reward_system_health')
      .select()
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching system health:', error);
      return null;
    }

    return data;
  }

  static async runPerformanceTests() {
    const { data, error } = await supabase
      .rpc('test_reward_system_performance');

    if (error) {
      console.error('Error running performance tests:', error);
      return null;
    }

    return data;
  }
}
