
// Main chart components
export { default as AnalyticsLineChart } from './AnalyticsLineChart';
export { default as AnalyticsBarChart } from './AnalyticsBarChart';
export { default as AnalyticsPieChart } from './AnalyticsPieChart';
export { default as AnalyticsMetricCard } from './AnalyticsMetricCard';

// Wrapper components for different use cases
export { LegacyLineChart, LegacyBarChart, SmartChart } from './ChartWrapper';

// Type definitions
export interface ChartDataPoint {
  name: string;
  [key: string]: any;
}

export interface ChartSeriesConfig {
  key: string;
  name: string;
  color: string;
}

export interface BaseChartProps {
  data: ChartDataPoint[];
  height?: number;
  title?: string;
  description?: string;
  formatter?: (value: any) => any;
}

export interface EnhancedChartProps extends BaseChartProps {
  series?: ChartSeriesConfig[];
}
