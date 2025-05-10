
import { supabase } from '@/lib/supabase';

// Define missing or inconsistent types
interface SystemHealthMetric {
  id?: string;
  status: 'healthy' | 'degraded' | 'error';
  response_time_ms: number;
  transaction_count: number;
  error_count: number;
  timestamp?: string;
  details?: Record<string, any>;
}

interface PerformanceMetric {
  id?: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  context?: Record<string, any>;
  timestamp?: string;
}

interface PerformanceTestResult {
  [key: string]: {
    duration_ms: number;
    status: 'fast' | 'average' | 'slow' | 'error';
    rows_processed?: number;
  };
}

type HealthStatus = 'healthy' | 'degraded' | 'error';

function isValidHealthStatus(status: string): status is HealthStatus {
  return ['healthy', 'degraded', 'error'].includes(status);
}

function sanitizeDetails(details: unknown): Record<string, any> {
  if (typeof details === 'object' && details !== null) {
    return details as Record<string, any>;
  }
  return {};
}

export class RewardsSystemMonitor {
  static async recordHealthMetric(metric: SystemHealthMetric): Promise<boolean> {
    try {
      if (!isValidHealthStatus(metric.status)) {
        console.error('Invalid status value for health metric:', metric.status);
        return false;
      }

      const { error } = await supabase
        .from('reward_system_health')
        .insert({
          status: metric.status,
          response_time_ms: metric.response_time_ms,
          transaction_count: metric.transaction_count,
          error_count: metric.error_count,
          details: sanitizeDetails(metric.details)
        });

      if (error) {
        console.error('Error recording health metric:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception recording health metric:', error);
      return false;
    }
  }

  static async recordPerformanceMetric(metric: PerformanceMetric): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reward_performance_metrics')
        .insert({
          metric_type: metric.metric_type,
          metric_name: metric.metric_name,
          metric_value: metric.metric_value,
          context: metric.context || {}
        });

      if (error) {
        console.error('Error recording performance metric:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception recording performance metric:', error);
      return false;
    }
  }

  static async getSystemHealth(): Promise<SystemHealthMetric | null> {
    try {
      const { data, error } = await supabase
        .from('reward_system_health')
        .select()
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching system health:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      if (!isValidHealthStatus(data.status)) {
        console.error('Invalid status value from database:', data.status);
        return null;
      }

      return {
        status: data.status,
        response_time_ms: data.response_time_ms,
        transaction_count: data.transaction_count,
        error_count: data.error_count,
        details: sanitizeDetails(data.details)
      };
    } catch (error) {
      console.error('Exception fetching system health:', error);
      return null;
    }
  }

  static async runPerformanceTests(): Promise<PerformanceTestResult> {
    try {
      const { data, error } = await supabase
        .rpc('test_reward_system_performance');

      if (error) {
        console.error('Error running performance tests:', error);
        return {};
      }

      if (!data || !Array.isArray(data)) {
        console.error('Invalid performance test data format:', data);
        return {};
      }

      const transformedData: PerformanceTestResult = {};
      
      data.forEach(test => {
        if (!test.test_name || typeof test.duration_ms !== 'number') {
          console.warn('Skipping invalid test result:', test);
          return;
        }

        const displayName = test.test_name.replace(/_/g, ' ');
        
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
    } catch (error) {
      console.error('Exception running performance tests:', error);
      return {};
    }
  }
}
