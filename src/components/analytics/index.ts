
// Analytics Feature Module - Consolidated exports

// Main analytics components
export { default as AnalyticsLineChart } from './charts/AnalyticsLineChart';
export { default as AnalyticsBarChart } from './charts/AnalyticsBarChart';
export { default as AnalyticsPieChart } from './charts/AnalyticsPieChart';
export { default as AnalyticsMetricCard } from './charts/AnalyticsMetricCard';

// Chart wrappers
export { LegacyLineChart, LegacyBarChart, SmartChart } from './charts/ChartWrapper';

// Tabs
export { EngagementTab } from './tabs/EngagementTab';

// Engagement panels
export { default as LoyaltyProgramPanel } from './engagement/LoyaltyProgramPanel';
export { default as ContentAnalyticsPanel } from './engagement/ContentAnalyticsPanel';
export { default as FeedbackAnalyticsPanel } from './engagement/FeedbackAnalyticsPanel';

// Types
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
