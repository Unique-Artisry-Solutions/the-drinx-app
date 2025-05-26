
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

// Enhanced validation helpers to catch interface mismatches
export const validateMetricsStructure = (metrics: any): metrics is RealTimeMetrics => {
  const requiredFields = ['activeUsers', 'pageViews', 'conversions', 'revenue', 'eventCount', 'userEngagement'];
  
  if (!metrics || typeof metrics !== 'object') {
    console.error('Metrics validation failed: not an object', metrics);
    return false;
  }

  for (const field of requiredFields) {
    if (typeof metrics[field] !== 'number') {
      console.error(`Metrics validation failed: ${field} is not a number`, metrics[field]);
      return false;
    }
  }

  return true;
};

export const validateTimeFrameStructure = (data: any[]): data is AnalyticsTimeFrame[] => {
  if (!Array.isArray(data)) {
    console.error('TimeFrame validation failed: not an array', data);
    return false;
  }

  return data.every((item, index) => {
    const requiredFields = ['date', 'activeUsers', 'conversions', 'revenue'];
    
    if (!item || typeof item !== 'object') {
      console.error(`TimeFrame validation failed at index ${index}: not an object`, item);
      return false;
    }

    for (const field of requiredFields) {
      if (field === 'date') {
        if (typeof item[field] !== 'string') {
          console.error(`TimeFrame validation failed at index ${index}: ${field} is not a string`, item[field]);
          return false;
        }
      } else {
        if (typeof item[field] !== 'number') {
          console.error(`TimeFrame validation failed at index ${index}: ${field} is not a number`, item[field]);
          return false;
        }
      }
    }

    return true;
  });
};

export const validateChartDataStructure = (data: any[]): data is OptimizedChartDataPoint[] => {
  if (!Array.isArray(data)) {
    console.error('ChartData validation failed: not an array', data);
    return false;
  }

  return data.every((item, index) => {
    const requiredFields = {
      date: 'string',
      metric: 'string',
      value: 'number',
      trend: 'number',
      changePercentage: 'number'
    };

    if (!item || typeof item !== 'object') {
      console.error(`ChartData validation failed at index ${index}: not an object`, item);
      return false;
    }

    for (const [field, expectedType] of Object.entries(requiredFields)) {
      if (typeof item[field] !== expectedType) {
        console.error(`ChartData validation failed at index ${index}: ${field} is not a ${expectedType}`, item[field]);
        return false;
      }
    }

    return true;
  });
};

// Additional validation helper for interface alignment checking
export const validateDataAgainstInterface = <T>(
  data: any, 
  interfaceName: string, 
  validator: (data: any) => data is T
): T | null => {
  console.log(`Validating data against ${interfaceName} interface...`);
  
  if (validator(data)) {
    console.log(`✓ Data successfully validated against ${interfaceName}`);
    return data as T;
  } else {
    console.error(`✗ Data validation failed for ${interfaceName}`, data);
    return null;
  }
};

// Mock data generators with built-in validation
export const createValidatedMockMetrics = (overrides?: Partial<RealTimeMetrics>): RealTimeMetrics => {
  const mockData = createMockMetrics(overrides);
  const validated = validateDataAgainstInterface(mockData, 'RealTimeMetrics', validateMetricsStructure);
  
  if (!validated) {
    throw new Error('Failed to create valid mock metrics');
  }
  
  return validated;
};

export const createValidatedMockTimeFrameData = (days: number = 7): AnalyticsTimeFrame[] => {
  const mockData = createMockTimeFrameData(days);
  const validated = validateDataAgainstInterface(mockData, 'AnalyticsTimeFrame[]', validateTimeFrameStructure);
  
  if (!validated) {
    throw new Error('Failed to create valid mock time frame data');
  }
  
  return validated;
};

export const createValidatedMockChartData = (days: number = 30): OptimizedChartDataPoint[] => {
  const mockData = createMockChartData(days);
  const validated = validateDataAgainstInterface(mockData, 'OptimizedChartDataPoint[]', validateChartDataStructure);
  
  if (!validated) {
    throw new Error('Failed to create valid mock chart data');
  }
  
  return validated;
};

// Runtime interface checking utility
export const checkInterfaceCompliance = (data: any, expectedFields: Record<string, string>): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  for (const [field, expectedType] of Object.entries(expectedFields)) {
    if (typeof data[field] !== expectedType) {
      console.warn(`Interface compliance check failed: ${field} expected ${expectedType}, got ${typeof data[field]}`);
      return false;
    }
  }

  return true;
};
