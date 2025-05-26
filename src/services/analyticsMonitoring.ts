import { supabase } from '@/lib/supabase';

export interface AnalyticsError {
  service: string;
  method: string;
  error: string;
  timestamp: string;
  context?: Record<string, any>;
}

export interface PerformanceMetric {
  service: string;
  method: string;
  duration: number;
  timestamp: string;
  success: boolean;
}

class AnalyticsMonitor {
  private errorQueue: AnalyticsError[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Flush queues every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushQueues();
    }, 30000);
  }

  logError(service: string, method: string, error: Error | string, context?: Record<string, any>) {
    const errorEntry: AnalyticsError = {
      service,
      method,
      error: error instanceof Error ? error.message : error,
      timestamp: new Date().toISOString(),
      context
    };

    console.error(`[Analytics Error] ${service}.${method}:`, errorEntry);
    this.errorQueue.push(errorEntry);

    // Flush immediately for critical errors
    if (this.errorQueue.length > 10) {
      this.flushQueues();
    }
  }

  logPerformance(service: string, method: string, duration: number, success: boolean) {
    const performanceEntry: PerformanceMetric = {
      service,
      method,
      duration,
      timestamp: new Date().toISOString(),
      success
    };

    console.info(`[Analytics Performance] ${service}.${method}: ${duration}ms (${success ? 'success' : 'failed'})`);
    this.performanceQueue.push(performanceEntry);
  }

  async measurePerformance<T>(
    service: string,
    method: string,
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    let success = false;
    
    try {
      const result = await operation();
      success = true;
      return result;
    } catch (error) {
      this.logError(service, method, error as Error, context);
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      this.logPerformance(service, method, duration, success);
    }
  }

  private async flushQueues() {
    if (this.errorQueue.length === 0 && this.performanceQueue.length === 0) {
      return;
    }

    try {
      // Log errors to analytics_events table
      if (this.errorQueue.length > 0) {
        const errorEvents = this.errorQueue.map(error => ({
          event_type: 'analytics_error',
          event_data: error,
          timestamp: error.timestamp
        }));

        await supabase.from('analytics_events').insert(errorEvents);
        console.info(`[Analytics Monitor] Flushed ${this.errorQueue.length} error events`);
        this.errorQueue = [];
      }

      // Log performance metrics
      if (this.performanceQueue.length > 0) {
        const performanceEvents = this.performanceQueue.map(metric => ({
          event_type: 'analytics_performance',
          event_data: metric,
          timestamp: metric.timestamp
        }));

        await supabase.from('analytics_events').insert(performanceEvents);
        console.info(`[Analytics Monitor] Flushed ${this.performanceQueue.length} performance events`);
        this.performanceQueue = [];
      }
    } catch (error) {
      console.error('[Analytics Monitor] Failed to flush queues:', error);
      // Keep the queues for next attempt but limit size
      this.errorQueue = this.errorQueue.slice(-50);
      this.performanceQueue = this.performanceQueue.slice(-100);
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushQueues();
  }
}

export const analyticsMonitor = new AnalyticsMonitor();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analyticsMonitor.destroy();
  });
}
