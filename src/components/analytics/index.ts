
// Analytics Feature Module - Phase 5 Cleaned
// Essential analytics components only

// Tabs
export { EngagementTab } from './tabs/EngagementTab';

// Engagement panels
export { default as LoyaltyProgramPanel } from './engagement/LoyaltyProgramPanel';
export { default as ContentAnalyticsPanel } from './engagement/ContentAnalyticsPanel';
export { default as FeedbackAnalyticsPanel } from './engagement/FeedbackAnalyticsPanel';

// Types from centralized location
export type { ChartDataPoint, ChartSeriesConfig, BaseChartProps } from '../../types/charts';
