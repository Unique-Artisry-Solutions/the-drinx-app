
// Charts Module - Updated for Phase 9C
// Import types from centralized location
export type { ChartDataPoint, ChartSeriesConfig, BaseChartProps } from '../../types';

// Chart component exports
export { default as AnalyticsLineChart } from './AnalyticsLineChart';
export { default as AnalyticsBarChart } from './AnalyticsBarChart';
export { default as AnalyticsPieChart } from './AnalyticsPieChart';
export { default as AnalyticsMetricCard } from './AnalyticsMetricCard';

// Wrapper components
export { LegacyLineChart, LegacyBarChart, SmartChart } from './ChartWrapper';

// Enhanced chart props interface extending base props
export interface EnhancedChartProps extends BaseChartProps {
  series?: ChartSeriesConfig[];
}
