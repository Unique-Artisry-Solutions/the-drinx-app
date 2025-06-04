
// Analytics Feature Module - Consolidated exports

// Tabs
export { EngagementTab } from './tabs/EngagementTab';

// Engagement panels
export { default as LoyaltyProgramPanel } from './engagement/LoyaltyProgramPanel';
export { default as ContentAnalyticsPanel } from './engagement/ContentAnalyticsPanel';
export { default as FeedbackAnalyticsPanel } from './engagement/FeedbackAnalyticsPanel';

// Types - re-export from centralized location
export type { ChartDataPoint, ChartSeriesConfig, BaseChartProps } from '../../types';
