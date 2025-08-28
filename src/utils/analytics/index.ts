// Central re-exports for backward compatibility
// This ensures existing imports continue to work

// Event tracking exports
export type { AnalyticsEvent } from './events';
export { trackEvent } from './events';

// Provider/data fetching exports  
export {
  getAnalyticsData,
  getUserRetention,
  getEventSummary,
  getPopularPages,
  getSegmentAnalytics,
  getSegmentGrowthData,
  getSegmentOverlap,
  getSegmentMovementAnalytics,
  scheduleReport,
  calculateAudienceSize,
  analyzeSegmentRelationships,
  findInfluentialUsers,
  analyzeSegmentConnectionStrength,
  mapAudienceNetwork,
  getCrossSegmentEngagement
} from './providers';

// Formatting and helper exports
export {
  formatAnalyticsNumber,
  formatPercentage,
  formatDateRange,
  formatDuration,
  calculatePercentageChange,
  formatTimePeriod,
  getAnalyticsColors,
  sanitizeAnalyticsString,
  groupAnalyticsDataByPeriod
} from './format';