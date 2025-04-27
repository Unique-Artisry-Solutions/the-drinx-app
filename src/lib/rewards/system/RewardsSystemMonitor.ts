
import { supabase } from '@/lib/supabase';

export interface SystemHealthMetric {
  status: 'healthy' | 'degraded' | 'error';
  response_time_ms: number;
  transaction_count: number;
  error_count: number;
  details?: Record<string, any>;
}

export interface PerformanceMetric {
  metricType: string;
  metricName: string;
  metricValue: number;
  context?: Record<string, any>;
}

// Added this interface for better typing of performance test results
export interface PerformanceTestResult {
  [testName: string]: {
    duration_ms: number;
    status: 'fast' | 'average' | 'slow' | 'error';
    rows_processed?: number;
  };
}

export class RewardsSystemMonitor {
  static async recordHealthMetric(metric: SystemHealthMetric) {
    const { error } = await supabase
      .from('reward_system_health')
      .insert({
        status: metric.status,
        response_time_ms: metric.response_time_ms,
        transaction_count: metric.transaction_count,
        error_count: metric.error_count,
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

  // Improved runPerformanceTests method with better error handling and data transformation
  static async runPerformanceTests(): Promise<PerformanceTestResult | null> {
    try {
      const { data, error } = await supabase
        .rpc('test_reward_system_performance');

      if (error) {
        console.error('Error running performance tests:', error);
        return null;
      }

      // Transform from array format to object format
      if (!data || !Array.isArray(data)) {
        console.error('Invalid performance test data format:', data);
        return null;
      }

      // Transform the data into a more usable format
      const transformedData: PerformanceTestResult = {};
      
      data.forEach(test => {
        if (!test.test_name || typeof test.duration_ms !== 'number') {
          console.warn('Skipping invalid test result:', test);
          return;
        }

        // Create a human-readable test name by replacing underscores with spaces
        const displayName = test.test_name.replace(/_/g, ' ');
        
        // Determine status based on duration
        let status: 'fast' | 'average' | 'slow' | 'error' = 'average';
        if (test.status === 'error') {
          status = 'error';
        } else if (typeof test.duration_ms === 'number') {
          if (test.duration_ms < 100) status = 'fast';
          else if (test.duration_ms > 500) status = 'slow';
        }

        transformedData[displayName] = {
          duration_ms: test.duration_ms,
          status,
          rows_processed: test.rows_processed
        };
      });

      return transformedData;
    } catch (e) {
      console.error('Exception running performance tests:', e);
      return null;
    }
  }
}
