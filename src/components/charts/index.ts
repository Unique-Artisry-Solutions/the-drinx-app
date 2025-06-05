
// Charts Module - Phase 5 Cleaned
// Simplified chart exports

// Types from centralized location
export type { ChartDataPoint, ChartSeriesConfig, BaseChartProps } from '../../types/charts';

// Chart components
export { default as AnalyticsLineChart } from './AnalyticsLineChart';
export { default as AnalyticsBarChart } from './AnalyticsBarChart';
export { default as AnalyticsPieChart } from './AnalyticsPieChart';
export { default as AnalyticsMetricCard } from './AnalyticsMetricCard';

// Wrapper components
export { LegacyLineChart, LegacyBarChart, SmartChart } from './ChartWrapper';
