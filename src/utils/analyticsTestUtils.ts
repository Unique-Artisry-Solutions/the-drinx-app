
import { RealTimeMetrics, AnalyticsTimeFrame, OptimizedChartDataPoint } from '@/services/optimizedRealTimeAnalyticsService';

export const createMockMetrics = (overrides?: Partial<RealTimeMetrics>): RealTimeMetrics => ({
  activeUsers: 100,
  pageViews: 500,
  conversions: 25,
  revenue: 1250,
  eventCount: 750,
  userEngagement: 0.75,
  ...overrides
});

export const createMockTimeFrameData = (days: number = 7): AnalyticsTimeFrame[] => {
  const data: AnalyticsTimeFrame[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      activeUsers: Math.floor(Math.random() * 50) + 100,
      conversions: Math.floor(Math.random() * 20) + 20,
      revenue: Math.floor(Math.random() * 1000) + 1000
    });
  }
  
  return data;
};

export const createMockChartData = (days: number = 30): OptimizedChartDataPoint[] => {
  const data: OptimizedChartDataPoint[] = [];
  const today = new Date();
  const metrics = ['activeUsers', 'conversions', 'revenue', 'pageViews'];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    metrics.forEach(metric => {
      data.push({
        date: date.toISOString().split('T')[0],
        metric,
        value: Math.floor(Math.random() * 100) + 50,
        trend: Math.floor(Math.random() * 20) - 10,
        changePercentage: Math.floor(Math.random() * 30) - 15
      });
    });
  }
  
  return data;
};

export const simulateServiceError = (errorMessage: string = 'Service temporarily unavailable') => {
  return Promise.reject(new Error(errorMessage));
};

export const simulateServiceDelay = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

// Validation helpers
export const validateMetricsStructure = (metrics: any): metrics is RealTimeMetrics => {
  return (
    typeof metrics === 'object' &&
    typeof metrics.activeUsers === 'number' &&
    typeof metrics.pageViews === 'number' &&
    typeof metrics.conversions === 'number' &&
    typeof metrics.revenue === 'number' &&
    typeof metrics.eventCount === 'number' &&
    typeof metrics.userEngagement === 'number'
  );
};

export const validateChartDataStructure = (data: any[]): data is OptimizedChartDataPoint[] => {
  return Array.isArray(data) && data.every(item =>
    typeof item === 'object' &&
    typeof item.date === 'string' &&
    typeof item.metric === 'string' &&
    typeof item.value === 'number' &&
    typeof item.trend === 'number' &&
    typeof item.changePercentage === 'number'
  );
};
