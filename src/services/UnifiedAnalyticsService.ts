
// Unified Analytics Service - consolidates all analytics functionality
import { serviceConfig } from './ServiceConfig';
import { ServiceUtils, type ServiceResponse } from './ServiceUtils';

export interface AnalyticsMetrics {
  pageViews: number;
  uniqueUsers: number;
  conversions: number;
  revenue: number;
  eventCount: number;
  userEngagement: number;
}

export interface EventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TrendDataPoint {
  period: string;
  metric: string;
  value: number;
  change: number;
}

export class UnifiedAnalyticsService {
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    const config = serviceConfig.getConfig();
    if (config.enableLogging) {
      console.log('UnifiedAnalyticsService: Initializing...');
    }
    
    this.initialized = true;
  }

  // Real-time metrics
  static async getRealTimeMetrics(): Promise<AnalyticsMetrics> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      pageViews: Math.floor(Math.random() * 10000) + 5000,
      uniqueUsers: Math.floor(Math.random() * 2000) + 1000,
      conversions: Math.floor(Math.random() * 500) + 200,
      revenue: Math.floor(Math.random() * 50000) + 25000,
      eventCount: Math.floor(Math.random() * 100) + 50,
      userEngagement: Math.random() * 100 + 50
    };
  }

  // Event analytics
  static async getEventAnalytics(eventId?: string): Promise<EventAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalAttendees: Math.floor(Math.random() * 500) + 100,
      checkedInAttendees: Math.floor(Math.random() * 300) + 50,
      revenue: Math.floor(Math.random() * 25000) + 10000,
      conversionRate: Math.random() * 50 + 25
    };
  }

  // Chart data
  static async getChartData(days: number = 30): Promise<ChartDataPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const data: ChartDataPoint[] = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 1000) + 200,
        label: `Day ${days - i + 1}`
      });
    }
    
    return data;
  }

  // Trend data
  static async getTrendData(): Promise<TrendDataPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const metrics = ['users', 'revenue', 'conversions', 'engagement'];
    const trends: TrendDataPoint[] = [];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      metrics.forEach(metric => {
        trends.push({
          period: date.toISOString().slice(0, 7),
          metric,
          value: Math.floor(Math.random() * 1000) + 100,
          change: (Math.random() - 0.5) * 100
        });
      });
    }
    
    return trends;
  }

  // Time frame data
  static async getAnalyticsTimeFrameData(days: number): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        metrics: {
          users: Math.floor(Math.random() * 100) + 50,
          sessions: Math.floor(Math.random() * 150) + 75,
          revenue: Math.floor(Math.random() * 1000) + 500
        }
      });
    }
    
    return data;
  }

  // Subscriptions for real-time updates
  static subscribeToRealTimeAnalytics(callback: (metrics: AnalyticsMetrics) => void): () => void {
    const interval = setInterval(async () => {
      const metrics = await this.getRealTimeMetrics();
      callback(metrics);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }

  static subscribeToEventAnalytics(eventId: string, callback: (analytics: EventAnalytics) => void): () => void {
    const interval = setInterval(async () => {
      const analytics = await this.getEventAnalytics(eventId);
      callback(analytics);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      await this.getRealTimeMetrics();
      return true;
    } catch (error) {
      console.error('UnifiedAnalyticsService health check failed:', error);
      return false;
    }
  }
}
