
import { supabase } from '@/lib/supabase';
import { toJsonCompatible, prepareDatabaseRecord } from '@/utils/databaseSerialization';
import { validateAnalyticsError, validatePerformanceMetric, validateData } from '@/utils/analyticsValidation';
import { analyticsFallback, safeExecute, retryWithBackoff, createGracefulAnalytics } from '@/utils/analyticsFallback';

export interface AnalyticsError {
  service: string;
  method: string;
  error: string;
  timestamp: string;
  context?: Record<string, any>;
  [key: string]: any; // Index signature for Supabase Json compatibility
}

export interface PerformanceMetric {
  service: string;
  method: string;
  duration: number;
  timestamp: string;
  success: boolean;
  [key: string]: any; // Index signature for Supabase Json compatibility
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

    // Validate the error entry
    const validatedError = validateData(errorEntry, validateAnalyticsError, 'AnalyticsError');
    if (!validatedError) {
      console.error('Failed to validate analytics error, adding to fallback queue');
      analyticsFallback.addError(errorEntry);
      return;
    }

    console.error(`[Analytics Error] ${service}.${method}:`, validatedError);
    this.errorQueue.push(validatedError);

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

    // Validate the performance entry
    const validatedMetric = validateData(performanceEntry, validatePerformanceMetric, 'PerformanceMetric');
    if (!validatedMetric) {
      console.error('Failed to validate performance metric, adding to fallback queue');
      analyticsFallback.addPerformanceMetric(performanceEntry);
      return;
    }

    console.info(`[Analytics Performance] ${service}.${method}: ${duration}ms (${success ? 'success' : 'failed'})`);
    this.performanceQueue.push(validatedMetric);
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

  private async insertAnalyticsEvents(events: any[], eventType: string): Promise<boolean> {
    return await retryWithBackoff(async () => {
      const { error } = await supabase
        .from('analytics_events')
        .insert(events);

      if (error) {
        throw new Error(`Failed to insert ${eventType} events: ${error.message}`);
      }

      return true;
    }, 2, 1000, `insert ${eventType} events`) !== null;
  }

  private async flushQueues() {
    if (this.errorQueue.length === 0 && this.performanceQueue.length === 0) {
      return;
    }

    // Process error queue with fallback
    if (this.errorQueue.length > 0) {
      const errorEvents = this.errorQueue.map(error => {
        const prepared = prepareDatabaseRecord(
          {
            event_type: 'analytics_error',
            event_data: error,
            timestamp: error.timestamp
          },
          ['event_type', 'event_data', 'timestamp']
        );
        return prepared;
      }).filter(Boolean);

      if (errorEvents.length > 0) {
        const success = await safeExecute(
          () => this.insertAnalyticsEvents(errorEvents, 'error'),
          () => {
            // Add failed items to fallback queue
            this.errorQueue.forEach(error => {
              analyticsFallback.addError(error);
            });
          },
          'flush error queue'
        );

        if (success) {
          console.info(`[Analytics Monitor] Flushed ${this.errorQueue.length} error events`);
          this.errorQueue = [];
        }
      }
    }

    // Process performance queue with fallback
    if (this.performanceQueue.length > 0) {
      const performanceEvents = this.performanceQueue.map(metric => {
        const prepared = prepareDatabaseRecord(
          {
            event_type: 'analytics_performance',
            event_data: metric,
            timestamp: metric.timestamp
          },
          ['event_type', 'event_data', 'timestamp']
        );
        return prepared;
      }).filter(Boolean);

      if (performanceEvents.length > 0) {
        const success = await safeExecute(
          () => this.insertAnalyticsEvents(performanceEvents, 'performance'),
          () => {
            // Add failed items to fallback queue
            this.performanceQueue.forEach(metric => {
              analyticsFallback.addPerformanceMetric(metric);
            });
          },
          'flush performance queue'
        );

        if (success) {
          console.info(`[Analytics Monitor] Flushed ${this.performanceQueue.length} performance events`);
          this.performanceQueue = [];
        }
      }
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushQueues();
  }

  // Get system health status
  getHealth() {
    const fallbackHealth = analyticsFallback.getQueueSizes();
    return {
      activeQueues: {
        errors: this.errorQueue.length,
        performance: this.performanceQueue.length
      },
      fallbackQueues: fallbackHealth,
      totalQueuedItems: this.errorQueue.length + this.performanceQueue.length + fallbackHealth.errors + fallbackHealth.performance
    };
  }
}

export const analyticsMonitor = new AnalyticsMonitor();

// Create graceful versions of key methods
export const gracefulLogError = createGracefulAnalytics(
  analyticsMonitor.logError.bind(analyticsMonitor)
);

export const gracefulLogPerformance = createGracefulAnalytics(
  analyticsMonitor.logPerformance.bind(analyticsMonitor)
);

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analyticsMonitor.destroy();
  });
}
